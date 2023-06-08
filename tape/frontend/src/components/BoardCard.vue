<script setup lang="ts">
interface Props {
  board: Board;
}

defineProps<Props>();
</script>

<template>
  <v-card width="100%">
    <v-card-title>
      {{ board.boardName }}
      <span class="text-caption"> {{ `#${board.boardId}` }}</span>
    </v-card-title>
    <v-card-subtitle>
      <span v-if="!board.isAnonymous" class="mr-4">{{ board.author }}</span>
      <v-chip v-else class="mr-4">匿名</v-chip>
      <span>{{
        new Date(board.createdAt).toLocaleDateString()
      }}</span></v-card-subtitle
    >
    <v-card-text> </v-card-text>
    <v-card-actions>
      <router-link
        :to="{ name: 'BoardDetail', params: { boardId: board.boardId } }"
      >
        <v-btn prepend-icon="mdi-arrow-right">进入观看回复</v-btn>
      </router-link>
    </v-card-actions>
  </v-card>
</template>
