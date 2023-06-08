<script setup lang="ts">
interface Props {
  confession: Confession;
}

defineProps<Props>();
</script>

<template>
  <v-card width="100%" class="py-4">
    <v-card-text>{{ confession.confessionText }}</v-card-text>
  </v-card>
</template>
