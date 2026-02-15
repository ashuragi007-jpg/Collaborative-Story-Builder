import { userState } from "../state/userState.mjs";
import { usersActions } from "../logic/usersActions.mjs";

class UserEdit extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="card">
        <h2>Edit user</h2>

        <div class="row">
          <select></select>
          <input placeholder="New username" />
          <button>Save</button>
        </div>

        <p class="error" hidden></p>
      </section>
    `;

    const root = document.querySelector("#app");
    const select = this.querySelector("select");
    const input = this.querySelector("input");
    const btn = this.querySelector("button");
    const err = this.querySelector(".error");

    const render = () => {
      select.innerHTML = userState.users
        .map(u => `<option value="${u.id}">${u.username}</option>`)
        .join("");

      btn.disabled = userState.users.length === 0;
    };

    render();
    document.addEventListener("users:updated", render);

    btn.addEventListener("click", async () => {
      err.hidden = true;

      const id = select.value;
      const username = input.value.trim();

      if (!username) {
        err.textContent = "Username required";
        err.hidden = false;
        return;
      }

      try {
        await usersActions.editUser(root, id, username);
        input.value = "";
      } catch (e) {
        err.textContent = e.message;
        err.hidden = false;
      }
    });
  }
}

customElements.define("user-edit", UserEdit);