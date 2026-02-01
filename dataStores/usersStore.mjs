import fs from "node:fs/promises";
import path from "node:path";

const FILE = path.resolve("data/users.json");

async function readStore() {
  try {
    const txt = await fs.readFile(FILE, "utf-8");
    return JSON.parse(txt);
  } catch {
    return { byId: {}, byUsername: {} };
  }
}

async function writeStore(store) {
  await fs.mkdir(path.dirname(FILE), { recursive: true });
  await fs.writeFile(FILE, JSON.stringify(store, null, 2), "utf-8");
}

export async function createUser(user) {
  const store = await readStore();

  if (store.byUsername[user.username]) {
    const err = new Error("USERNAME_TAKEN");
    err.code = "USERNAME_TAKEN";
    throw err;
  }

  store.byId[user.id] = user;
  store.byUsername[user.username] = user.id;

  await writeStore(store);
  return user;
}

export async function getUserById(id) {
  const store = await readStore();
  return store.byId[id] ?? null;
}
