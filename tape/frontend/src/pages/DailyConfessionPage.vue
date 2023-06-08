<script setup lang="ts">
import { ref } from "vue";
import { useMutation, useQuery, useQueryClient } from "@tanstack/vue-query";
import { getConfessions, createConfession } from "../api";
import DailyConfession from "../components/DailyConfession.vue";

const { data, isLoading } = useQuery({
  queryKey: ["confessions"],
  queryFn: async () => getConfessions(),
});

const queryClient = useQueryClient();
const text = ref("");
const dialog = ref(false);

const mutation = useMutation({
  mutationFn: async () => createConfession(text.value),
  onSuccess: () => {
    dialog.value = false;
    queryClient.invalidateQueries(["confessions"]);
  },
});
</script>

<template>
  <div v-if="!isLoading" class="h-100 pa-4">
    <div class="text-h5 w-100">
      每日表白
      <v-dialog v-model="dialog" width="250">
        <template v-slot:activator="{ props }">
          <v-btn
            prepend-icon="mdi-heart-outline"
            color="primary"
            v-bind="props"
          >
            表白
          </v-btn>
        </template>

        <v-card>
          <v-card-title> 勇敢写出你的表白！ </v-card-title>
          <v-card-text>
            <v-form>
              <v-textarea v-model="text"></v-textarea>
            </v-form>
          </v-card-text>
          <v-card-actions>
            <v-btn @click="mutation.mutate" :loading="mutation.isLoading.value"
              >表白</v-btn
            >
            <v-btn color="primary" @click="dialog = false">关闭</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>
    <v-virtual-scroll class="h-100" :items="data">
      <template v-slot:default="{ item }">
        <daily-confession class="my-4" :confession="(item as Confession)" />
      </template>
    </v-virtual-scroll>
  </div>
</template>
