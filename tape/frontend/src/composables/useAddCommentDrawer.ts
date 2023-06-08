import { reactive } from "vue";

interface AddCommentDrawer {
  isDrawerOpen: boolean;
  replyToCommentId?: number;
  boardId?: number;
  commentText: string;
}

export const addCommentDrawer = reactive<AddCommentDrawer>({
  isDrawerOpen: false,
  replyToCommentId: undefined,
  commentText: "",
});

export function useAddCommentDrawer() {
  return addCommentDrawer;
}
