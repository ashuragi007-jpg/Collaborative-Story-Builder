import { userState } from "../state/userState.mjs";
import { usersActions } from "../logic/usersActions.mjs";

class AccountManage extends HTMLElement {
  connectedCallback() {
    this.render();
    document.addEventListener("users:updated", () => this.render());
    document.addEventListener("session:changed", () => this.render());
  }

  render() {
    const id = userState.currentUserId;

    if (!id) {
      this.innerHTML = "";
      return;
    }

    const user = userState.users.find(u => u.id === id);
    if (!user) {
      this.innerHTML = "<p>User not found</p>";
      return;
    }

    this.innerHTML = `
      <section class="card">
        <h2>Manage Account</h2>

        <div>
          <label>Edit username:</label>
          <input id="nameInput" value="${user.username}">
          <button id="saveBtn">Save</button>
        </div>

        <hr>

        <button id="deleteBtn">Delete My Account</button>
      </section>
    `;

    this.querySelector("#saveBtn").onclick = async () => {
      const newName = this.querySelector("#nameInput").value.trim();
      await usersActions.editUser(document.querySelector("#app"), id, newName);
    };

    this.querySelector("#deleteBtn").onclick = async () => {
      if (!confirm("Delete your account?")) return;
      await usersActions.deleteUser(document.querySelector("#app"), id);
      userState.setCurrentUserId(null);
      document.dispatchEvent(new Event("session:changed"));
    };
  }
}

customElements.define("account-manage", AccountManage);