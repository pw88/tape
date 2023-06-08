<script setup lang="ts">
import { computed } from "vue";
import { useUser } from "../composables/useUser";

interface Props {
  comment: Comment;
  comments: Comment[];
}

import { useAddCommentDrawer } from "../composables/useAddCommentDrawer";
const drawer = useAddCommentDrawer();
const props = defineProps<Props>();

const replyComment = computed(() => {
  return props.comments.find(
    (comment) => comment.commentId === props.comment.replyToCommentId
  );
});

function jumpToMessage() {
  const el = document.getElementById(
    `comment-${replyComment.value?.commentId}`
  );
  el?.scrollIntoView({ behavior: "smooth" });
}
</script>

<template>
  <v-card width="100%" class="py-4">
    <v-card-subtitle>
      <span v-if="!comment.isAnonymous" class="mr-4">{{ comment.author }}</span>
      <v-chip v-else class="mr-4">匿名</v-chip>
      <span>{{
        new Date(comment.createdAt).toLocaleDateString()
      }}</span></v-card-subtitle
    >
    <v-card-text>
      <v-card
        v-if="
          comment.replyToCommentId !== undefined && replyComment !== undefined
        "
        variant="tonal"
        class="mx-2 my-4 pa-4 b-l-4 primary lighten-4"
      >
        <v-card-subtitle class="mb-2">
          <span v-if="!replyComment.isAnonymous" class="mr-4">{{
            replyComment.author
          }}</span>
          <v-chip v-else class="mr-4">匿名</v-chip>
          <span>{{
            new Date(replyComment.createdAt).toLocaleDateString()
          }}</span></v-card-subtitle
        >
        <v-card-text>
          <p>{{ replyComment.commentText }}</p>
        </v-card-text>
        <v-card-actions>
          <v-btn prepend-icon="mdi-arrow-right" @click="jumpToMessage"
            >跳去</v-btn
          >
        </v-card-actions>
      </v-card>
      <p>{{ comment.commentText }}</p>
    </v-card-text>
    <v-card-actions>
      <v-btn
        @click.stop="
          drawer.replyToCommentId = comment.commentId;
          drawer.isDrawerOpen = true;
        "
        >回复</v-btn
      >
    </v-card-actions>
  </v-card>
</template>
