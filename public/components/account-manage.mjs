import "../components/user-stories.mjs";
import { userState } from "../state/userState.mjs";
import { usersActions } from "../actions/usersActions.mjs";
import { translate } from "../utils/translate.mjs";

class AccountManage extends HTMLElement {
  connectedCallback() {
    const tpl = document.getElementById("tpl-account-manage");
    this.replaceChildren(tpl.content.cloneNode(true));

    this.root = document.querySelector("#app");

    this.infoId = this.querySelector(".info-id");
    this.infoUsername = this.querySelector(".info-username");
    this.infoCreated = this.querySelector(".info-created");

    this.form = this.querySelector(".edit-form");
    this.input = this.form.username;

    this.passwordForm = this.querySelector(".password-form");
    this.passwordInput = this.passwordForm.password;

    this.deleteBtn = this.querySelector(".delete-btn");
    this.logoutBtn = this.querySelector(".logout-btn");
    this.err = this.querySelector(".error");
    this.myStories = this.querySelector(".my-stories");

    this.logoutBtn.addEventListener("click", () => {
      userState.setCurrentUserId(null);
      localStorage.removeItem("currentUserId");
      localStorage.removeItem("currentUsername");
      document.dispatchEvent(new Event("session:changed"));
    });

    const rerender = () => this.render();
    document.addEventListener("users:updated", rerender);
    document.addEventListener("session:changed", rerender);

    this.form.addEventListener("submit", (e) => this.onSave(e));
    this.passwordForm.addEventListener("submit", (e) => this.onPasswordSave(e));
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

    this.infoId.textContent = u.id;
    this.infoUsername.textContent = u.username;
    this.infoCreated.textContent = u.tosAcceptedAt ?? "Unknown";

    this.input.value = u.username;
    this.passwordInput.value = "";
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

  async onPasswordSave(e) {
    e.preventDefault();
    this.setError("");

    const id = userState.currentUserId;
    const newPassword = this.passwordInput.value.trim();
    const lang = navigator.language;

    if (!confirm(translate(lang, "auth.confirmPasswordChange"))) {
      return;
    }

    try {
      await usersActions.editPassword(this.root, id, newPassword);
      this.passwordInput.value = "";
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
      localStorage.removeItem("currentUserId");
      localStorage.removeItem("currentUsername");
      document.dispatchEvent(new Event("session:changed"));
    } catch (e) {
      this.setError(e.message);
    }
  }
}

customElements.define("account-manage", AccountManage);