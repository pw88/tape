<script setup lang="ts">
import { ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useQuery, useMutation } from "@tanstack/vue-query";
import CommentCard from "../components/CommentCard.vue";
import { useAddCommentDrawer } from "../composables/useAddCommentDrawer";

import { getBoard, addComment } from "../api";

const route = useRoute();
const boardId = computed(() => Number(route.params.boardId));
const addCommentDrawer = useAddCommentDrawer();

const formData = ref({
  commentText: "",
  isAnonymous: false,
});

const { data, isLoading } = useQuery({
  queryKey: ["boards", boardId],
  queryFn: async () => await getBoard(boardId.value),
});

const mutation = useMutation({
  mutationFn: async () => {
    await addComment({
      boardId: boardId.value,
      commentText: formData.value.commentText,
      isAnonymous: formData.value.isAnonymous,
      replyToCommentId: addCommentDrawer.replyToCommentId,
    });
    addCommentDrawer.replyToCommentId = undefined;
    formData.value.commentText = "";
    formData.value.isAnonymous = false;
  },
});

const replyComment = computed(() => {
  if (isLoading.value) return undefined;
  return data.value.comments.find(
    (comment) => comment.commentId === addCommentDrawer.replyToCommentId
  );
});
</script>

<template>
  <div v-if="!isLoading" class="d-flex flex-1 flex-column py-4 px-8">
    <v-card width="100%">
      <v-card-title>
        {{ data.board.boardName }}
        <span class="text-caption"> {{ `#${data.board.boardId}` }}</span>
      </v-card-title>
      <v-card-subtitle>
        <span v-if="!data.board.isAnonymous" class="mr-4">{{
          data.board.author
        }}</span>
        <v-chip v-else class="mr-4">匿名</v-chip>
        <span>{{
          new Date(data.board.createdAt).toLocaleDateString()
        }}</span></v-card-subtitle
      >
      <v-card-actions>
        <v-btn @click="addCommentDrawer.isDrawerOpen = true">回复</v-btn>
      </v-card-actions>
    </v-card>
    <div class="comments mt-4">
      <comment-card
        v-for="comment in data.comments"
        :id="`comment-${comment.commentId}`"
        :comment="comment"
        :comments="data.comments"
      ></comment-card>
    </div>
  </div>
  <v-navigation-drawer
    v-model="addCommentDrawer.isDrawerOpen"
    location="bottom"
    class="pa-4"
  >
    <v-row>
      <v-col cols="3">
        <div class="text-body">匿名</div>
        <v-switch v-model="formData.isAnonymous"></v-switch>
      </v-col>
      <v-col>
        <v-card
          v-if="replyComment !== undefined"
          class="mb-4 py-1"
          variant="tonal"
        >
          <v-card-subtitle>
            <v-btn
              style="position: absolute; right: 0; top: 0; margin: 0.5rem"
              density="compact"
              icon="mdi-close"
              variant="plain"
              size="x-small"
              @click="addCommentDrawer.replyToCommentId = undefined"
            ></v-btn>
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
        </v-card>
      </v-col>
    </v-row>
    <v-form>
      <v-textarea
        label="写出你的回复"
        v-model="formData.commentText"
        no-resize
        :rows="replyComment ? 3 : 4"
      ></v-textarea>
      <v-btn @click="mutation.mutate" block>回复</v-btn>
    </v-form>
  </v-navigation-drawer>
</template>

<style scoped>
.comments {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}
</style>
