import user from "../dataObjects/user.mjs";
import { generateID } from "../dataObjects/user.mjs";
import { users } from "../dataStores/usersStore.mjs";

export function listUsers(){
    return users;
}

export function findUserById(id){
    return users.find(u => u.id === id);
}

export function createUser ({ username }) {
    const newUser = user();

    newUser.id = generateID();
    newUser.username = username.trim();

    newUser.consent ??= {};
    newUser.consent.tosAcceptedAt = new Date().toISOString();

    users.push(newUser);
    return newUser;
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