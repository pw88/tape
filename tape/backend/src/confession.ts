import { Router } from "express";
import { sql } from "./db";
import { attachUser } from "./middlewares";
const router = Router();

router.get("/", attachUser, async (req, res) => {
  const confessions =
    await sql`SELECT * FROM confessions WHERE created_at > NOW() - INTERVAL '24 hours' ORDER BY created_at DESC`;
  return res.status(200).json({ confessions });
});

router.post("/", attachUser, async (req, res) => {
  const [confession] = await sql`INSERT INTO confessions (confession_text)
                                  VALUES (${req.body.body})
                                  RETURNING *`;
  return res.status(200).json({ confession });
});

export default router;
