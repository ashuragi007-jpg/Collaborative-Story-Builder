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

export async function createChapter({ storyId, content, authorId }) {

  const result = await pool.query(
    `INSERT INTO chapters (id, story_id, content, author_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, story_id, content, author_id, created_at`,
    [
      crypto.randomUUID(),
      storyId,
      content,
      authorId
    ]
  );

  return result.rows[0];
}

export async function updateChapter(id, content) {
  const result = await pool.query(
    `UPDATE chapters
     SET content = $2
     WHERE id = $1
     RETURNING id, story_id, content, created_at`,
    [id, content]
  );

  const row = result.rows[0];

  if (!row) return null;

  return {
    id: row.id,
    storyId: row.story_id,
    content: row.content,
    createdAt: row.created_at
  };
}
