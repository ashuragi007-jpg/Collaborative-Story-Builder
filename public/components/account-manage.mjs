import { userState } from "../state/userState.mjs";
import { usersActions } from "../actions/usersActions.mjs";

class AccountManage extends HTMLElement {
  connectedCallback() {
    const tpl = document.getElementById("tpl-account-manage");
    this.replaceChildren(tpl.content.cloneNode(true));

    this.root = document.querySelector("#app");
    this.who = this.querySelector(".who");
    this.form = this.querySelector(".edit-form");
    this.input = this.form.username;
    this.deleteBtn = this.querySelector(".delete-btn");
    this.err = this.querySelector(".error");

    const rerender = () => this.render();
    document.addEventListener("users:updated", rerender);
    document.addEventListener("session:changed", rerender);

    this.form.addEventListener("submit", (e) => this.onSave(e));
    this.deleteBtn.addEventListener("click", () => this.onDelete());

    this.render();
  }

  setError(msg = "") {
    this.err.textContent = msg;
    this.err.hidden = !msg;
  }

  render() {
    const id = userState.currentUserId;

    if (!id) {
      this.hidden = true;
      return;
    }

    const u = userState.users.find(x => x.id === id);
    if (!u) {
      this.hidden = true;
      return;
    }

    this.hidden = false;
    this.who.textContent = `Logged in as: ${u.username} (${u.id})`;
    this.input.value = u.username;
    this.setError("");
  }

  async onSave(e) {
    e.preventDefault();
    this.setError("");

    const id = userState.currentUserId;
    const newName = this.input.value.trim();

    try {
      await usersActions.editUser(this.root, id, newName);
    } catch (e) {
      this.setError(e.message);
    }
  }

  async onDelete() {
    this.setError("");

    const id = userState.currentUserId;
    if (!id) return;

    if (!confirm("Delete your account?")) return;

    try {
      await usersActions.deleteUser(this.root, id);

      userState.setCurrentUserId(null);
      document.dispatchEvent(new Event("session:changed"));
    } catch (e) {
      this.setError(e.message);
    }
  }
}

customElements.define("account-manage", AccountManage);