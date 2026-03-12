import { pool } from "../db.mjs";
import crypto from "node:crypto";

export async function createStory({ title, description, authorId }) {
  const id = crypto.randomUUID();

  const result = await pool.query(
    `INSERT INTO stories (id, title, description, author_id)
     VALUES ($1, $2, $3, $4)
     RETURNING id, title, description, author_id, created_at`,
    [id, title.trim(), description ?? "", authorId]
  );

  return result.rows[0];
}

export async function listStories() {
  const result = await pool.query(
    `SELECT id, title, description, author_id, created_at
     FROM stories
     ORDER BY created_at DESC`
  );

  return result.rows;
}

export async function findStoryById(id) {
  const result = await pool.query(
    `SELECT id, title, description, author_id, created_at
     FROM stories
     WHERE id = $1`,
    [id]
  );

  return result.rows[0] ?? null;
}