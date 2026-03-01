import user from "../dataObjects/user.mjs";
import { generateID } from "../dataObjects/user.mjs";
import { users } from "../dataStores/usersStore.mjs";
import { pool } from "../db.mjs";


export async function listUsers() {
  const result = await pool.query(
    `select id, username, created_at
     from users
     order by created_at desc`
  );

  return result.rows.map(r => ({
    id: r.id,
    username: r.username,
    consent: { tosAcceptedAt: r.created_at }
  }));
}

export async function createUser({ username }) {
  const result = await pool.query(
    `insert into users (username, password_hash, tos_accepted)
     values ($1, $2, $3)
     returning id, username, created_at`,
    [username.trim(), "temp_hash", true]
  );

  const row = result.rows[0];

  return {
    id: row.id,
    username: row.username,
    consent: {
      tosAcceptedAt: row.created_at
    }
  };
}

export async function deleteUserById(id) {
  const result = await pool.query(
    `delete from users where id = $1`,
    [id]
  );

  return result.rowCount > 0;
}

export async function updateUsername(id, username) {
  const result = await pool.query(
    `update users
     set username = $2
     where id = $1
     returning id, username, created_at`,
    [id, username.trim()]
  );

  const row = result.rows[0];
  if (!row) return null;

  return {
    id: row.id,
    username: row.username,
    consent: { tosAcceptedAt: row.created_at }
  };
}