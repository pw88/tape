<script setup lang="ts">
import { ref } from "vue";
import { useMutation } from "@tanstack/vue-query";

import { createBoard } from "../api";

const formData = ref({
  title: "",
  content: "",
  isAnonymous: false,
});

const mutation = useMutation({
  mutationFn: async () => await createBoard(formData.value),
  onSuccess: () => {
    router.push("/");
  },
});
</script>

<template>
  <div class="h-100 d-flex">
    <v-card width="500" class="pa-4 h-auto mx-auto">
      <v-card-title>创建新匿名墙</v-card-title>
      <v-card-text>
        <v-form
          style="height: max-content"
          class="py-4"
          @submit.prevent="mutation.mutate"
        >
          <v-text-field v-model="formData.title" label="标题"></v-text-field>
          <v-switch v-model="formData.isAnonymous" label="匿名"></v-switch>
          <v-btn :loading="mutation.isLoading.value" block type="submit"
            >创建</v-btn
          >
        </v-form>
      </v-card-text>
    </v-card>
  </div>
</template>
