<script setup lang="ts">
import { useQuery } from "@tanstack/vue-query";
import BoardCard from "./BoardCard.vue";
import { getBoards } from "../api";

const { data, isLoading } = useQuery({
  queryKey: ["boards"],
  queryFn: async () => getBoards(),
});

interface Board {
  boardId: number;
  userId: number;
  boardName: string;
  isAnonymous: boolean;
  createdAt: string;
}
</script>

<template>
  <div v-if="!isLoading" class="board-listing py-4 px-8">
    <div class="text-h5 w-100">匿名墙</div>
    <v-virtual-scroll :items="data.boards" height="100%" width="100%">
      <template v-slot:default="{ item }">
        <board-card class="my-4" :board="(item as Board)" />
      </template>
    </v-virtual-scroll>
  </div>
</template>

<style scoped>
.board-listing {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}
</style>
