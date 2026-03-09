import { pool } from "../db.mjs";
import crypto from "node:crypto";

export async function listChapters() {
  const result = await pool.query(
    `SELECT id, story_id, content, created_at
     FROM chapters
     ORDER BY created_at DESC`
  );

  return result.rows;
}

export async function listChaptersByStoryId(storyId) {
  const result = await pool.query(
    `SELECT id, story_id, content, created_at
     FROM chapters
     WHERE story_id = $1
     ORDER BY created_at ASC`,
    [storyId]
  );

  return result.rows;
}

export async function findChapterById(id) {
  const result = await pool.query(
    `SELECT id, story_id, content, created_at
     FROM chapters
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] ?? null;
}

export async function createChapter({ storyId, content }) {
  const id = crypto.randomUUID();

  const result = await pool.query(
    `INSERT INTO chapters (id, story_id, content)
     VALUES ($1, $2, $3)
     RETURNING id, story_id, content, created_at`,
    [id, storyId, content]
  );

  return result.rows[0];
}