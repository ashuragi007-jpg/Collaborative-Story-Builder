import { userState } from "../state/userState.mjs";
import { api } from "./apiClient.mjs";


export const usersActions = {
  async loadUsers(root) {
    const data = await api("/users");
    userState.setUsers(Array.isArray(data) ? data : (data?.users ?? []));
    document.dispatchEvent(new Event("users:updated"));
  },

  async login(root, { username, password }) {
  const data = await api("/auth/login", {
    method: "POST",
    body: { username, password },
  });

  userState.setCurrentUserId(data.id);
  localStorage.setItem("currentUserId", data.id);
  localStorage.setItem("currentUsername", data.username);

  document.dispatchEvent(new Event("session:changed"));
  return data;
},

  async createUser(root, { username, password, ToSAccepted }) {
    const created = await api("/users", {
      method: "POST",
      body: { username, password, ToSAccepted, consentVersion: "1.0" },
    });
    await this.loadUsers(root);
    return created;
  },

  async deleteUser(root, id) {
    await api(`/users/${id}`, { method: "DELETE" });
    await this.loadUsers(root);
  },

  async editUser(root, id, username) {
  const clean = String(username ?? "").trim();
  if (!clean) throw new Error("Username required");

  await api(`/users/${id}`, {
    method: "PATCH",
    body: { username: clean }
  });
},

async editPassword(root, id, password) {
  const clean = String(password ?? "").trim();
  if (!clean) throw new Error("Password required");

  await api(`/users/${id}/password`, {
    method: "PATCH",
    body: { password: clean }
  });

  await this.loadUsers(root);
},
};
