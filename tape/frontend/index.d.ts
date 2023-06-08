// User interface
interface User {
  userId: number;
  username: string;
  password: string;
}

// Board interface
interface Board {
  boardId: number;
  userId: number;
  boardName: string;
  isAnonymous: boolean;
  createdAt: string;
}

interface Confession {
  confessionId: number;
  confessionText: string;
  createdAt: string;
}
// Comment interface
interface Comment {
  commentId: number;
  userId: number;
  boardId: number;
  commentText: string;
  isAnonymous: boolean;
  createdAt: string;
  replyToCommentId?: number;
}

// Like interface
interface Like {
  likeId: number;
  userId: number;
  commentId: number;
}

// Tag interface
interface Tag {
  tagId: number;
  tagName: string;
}

// Board-Tag interface
interface BoardTag {
  boardId: number;
  tagId: number;
}

// Login Session interface
interface LoginSession {
  sessionId: number;
  sessionToken: string;
  userId: number;
  expiryTime: string;
}
