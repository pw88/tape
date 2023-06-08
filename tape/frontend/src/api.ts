import axios from "axios";

const instance = axios.create({
  baseURL: "http://localhost:3000",
});

instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers["Authorization"] = token;
  return config;
});

export async function login({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const res = await instance.post("/auth/login", { username, password });
  return res.data;
}

export async function register({
  username,
  password,
}: {
  username: string;
  password: string;
}) {
  const res = await instance.post("/auth/register", { username, password });
  return res.data;
}

export async function getBoards() {
  const res = await instance.get("/boards");
  return res.data;
}

export async function getMyBoards() {
  const res = await instance.get("/auth/my-boards");
  return res.data;
}

export async function getBoard(boardId: number) {
  const res = await instance.get(`/boards/${boardId}`);
  return res.data;
}

export async function createBoard({
  title,
  isAnonymous,
}: {
  title: string;
  isAnonymous: boolean;
}) {
  const res = await instance.post("/boards", { title, isAnonymous });
  return res.data;
}

export async function addComment({
  boardId,
  commentText,
  isAnonymous,
  replyToCommentId,
}: {
  boardId: number;
  commentText: string;
  isAnonymous: boolean;
  replyToCommentId?: number;
}) {
  const res = await instance.post(`/boards/${boardId}/comment`, {
    commentText,
    isAnonymous,
    replyToCommentId,
  });
  return res.data;
}

export async function getUser() {
  const res = await instance.get("/auth/me");
  return res.data.user;
}

export async function getConfessions() {
  const res = await instance.get("/confessions");
  return res.data.confessions;
}

export async function createConfession(body: string) {
  const res = await instance.post("/confessions", { body });
  return res;
}
