import { Router } from "express";
import bcrypt from "bcrypt";
import crypto from "crypto";
import { sql } from "./db";
import { attachUser } from "./middlewares";

const router = Router();

router.post("/login", async (req, res) => {
  const [user]: [User?] =
    await sql`SELECT * FROM users WHERE username = ${req.body.username}`;
  if (!user) throw Error;
  if (!(await bcrypt.compare(req.body.password, user.password))) throw Error;
  const token = crypto.randomBytes(32).toString("hex");
  await sql`INSERT INTO login_sessions (session_token, user_id)
            VALUES (${token}, ${user.userId})`;
  return res.status(200).json({ token });
});

router.post("/register", async (req, res) => {
  const [user]: [User?] =
    await sql`SELECT * FROM users WHERE username = ${req.body.username}`;
  if (user !== undefined) throw Error;
  const password = await bcrypt.hash(req.body.password, 10);
  await sql`INSERT INTO users (username, password) 
            VALUES (${req.body.username}, ${password})`;
  return res.status(200).json({ message: "OK" });
});

router.post("/logout", attachUser, async (req, res) => {
  if (!req.user) return res.status(200).json({ message: "OK" });
  await sql`DELETE FROM login_sessions WHERE user_id = ${req.user.userId}`;
  return res.status(200).json({ message: "OK" });
});

router.get("/me", attachUser, async (req, res) => {
  if (!req.user) throw Error;
  console.log(req.user);
  const { userId, username } = req.user!;
  return res.status(200).json({ user: { userId, username } });
});

router.get("/my-boards", attachUser, async (req, res) => {
  const boards = await sql`SELECT 
                              boards.board_id,
                              boards.board_name, 
                              boards.created_at,
                              CASE WHEN boards.is_anonymous THEN 'Anonymous' ELSE users.username END AS author,
                              boards.is_anonymous,
                              array_agg(tags.tag_name) AS tags
                              FROM boards
                              JOIN users ON boards.user_id = users.user_id
                              LEFT JOIN board_tags ON boards.board_id = board_tags.board_id
                              LEFT JOIN tags ON board_tags.tag_id = tags.tag_id
                              WHERE boards.user_id = ${req.user!.userId}
                              GROUP BY boards.board_id, users.username
                              ORDER BY boards.created_at DESC`;
  const [{ count }] = await sql`SELECT COUNT(*) FROM boards`;
  return res.status(200).json({ boards, total: Number(count) });
});

export default router;
