import { userState } from "../state/userState.mjs";
import { api } from "./apiClient.mjs";


export const usersActions = {
  async loadUsers(root) {
    const data = await api("/users");
    userState.setUsers(Array.isArray(data) ? data : (data?.users ?? []));
    document.dispatchEvent(new Event("users:updated"));
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

  await this.loadUsers(root);
}
};
