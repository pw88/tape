import { Router } from "express";
import { sql } from "./db";
import { attachUser } from "./middlewares";

const router = Router();

router.get("/", attachUser, async (req, res) => {
  const boards = await sql`SELECT 
                            boards.board_id,
                            boards.board_name, 
                            boards.created_at,
                            boards.is_anonymous,
                            CASE WHEN boards.is_anonymous THEN 'Anonymous' ELSE users.username END AS author, 
                            array_agg(tags.tag_name) AS tags
                            FROM boards
                            JOIN users ON boards.user_id = users.user_id
                            LEFT JOIN board_tags ON boards.board_id = board_tags.board_id
                            LEFT JOIN tags ON board_tags.tag_id = tags.tag_id
                            GROUP BY boards.board_id, users.username
                            ORDER BY boards.created_at DESC`;
  const [{ count }] = await sql`SELECT COUNT(*) FROM boards`;
  return res.status(200).json({ boards, total: Number(count) });
});

router.post("/", attachUser, async (req, res) => {
  // Create a board
  const [{ boardId }]: [Pick<Board, "boardId">] =
    await sql`INSERT INTO boards (user_id, board_name, is_anonymous) 
                            VALUES (
                              ${req.user!.userId},
                              ${req.body.title}, 
                              ${req.body.isAnonymous}
                            ) RETURNING board_id`;
  return res.status(200).json({ message: "OK" });
});

router.get("/:boardId", attachUser, async (req, res) => {
  // Get board and its associated comments
  const [board]: [Board?] = await sql`SELECT 
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
                                        WHERE boards.board_id = ${req.params.boardId}
                                        GROUP BY boards.board_id, users.username`;
  if (!board) throw Error;
  const comments: Comment[] = await sql`SELECT 
                                              comments.comment_id,
                                              CASE WHEN comments.is_anonymous THEN 'Anonymous' ELSE users.username END AS author, 
                                              comments.comment_text, 
                                              comments.board_id,
                                              comments.user_id,
                                              comments.is_anonymous,
                                              comments.created_at,
                                              comments.reply_to_comment_id
                                              FROM comments
                                              JOIN users ON comments.user_id = users.user_id
                                              WHERE comments.board_id = ${req.params.boardId}`;

  const filteredComments = comments
    .filter((comment) => {
      return true;
    })
    .map(({ userId, ...rest }) => rest);

  return res.status(200).json({ board, comments: filteredComments });
});

router.post("/:boardId/comment", attachUser, async (req, res) => {
  await sql`INSERT INTO comments (user_id, board_id, comment_text, is_anonymous, reply_to_comment_id) 
                            VALUES (
                              ${req.user!.userId},
                              ${req.params.boardId},
                              ${req.body.commentText}, 
                              ${req.body.isAnonymous},
                              ${req.body.replyToCommentId || null}
                            )`;
  return res.status(200).json({ message: "OK" });
});

export default router;
