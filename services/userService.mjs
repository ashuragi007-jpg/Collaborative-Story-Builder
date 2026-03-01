import user from "../dataObjects/user.mjs";
import { generateID } from "../dataObjects/user.mjs";
import { users } from "../dataStores/usersStore.mjs";
import { pool } from "../db.mjs";

export function listUsers(){
    return users;
}

export function findUserById(id){
    return users.find(u => u.id === id);
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

export function deleteUserById(id) {
  const index = users.findIndex(u => u.id === id);
  if (index === -1) return false;
  users.splice(index, 1);
  return true;
}

export function updateUsername(id, username) {
  const u = users.find(x => x.id === id);
  if (!u) return null;
  u.username = username.trim();
  return u;
}