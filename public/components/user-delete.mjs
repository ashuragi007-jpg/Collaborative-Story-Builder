import { userState } from "../state/userState.mjs";
import { usersActions } from "../logic/usersActions.mjs";

const root = document.querySelector("#app");

class UserDelete extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="card">
        <h2>Delete user</h2>
        <div class="row">
          <select></select>
          <button>Delete</button>
        </div>
        <p class="error" hidden></p>
      </section>
    `;

    const select = this.querySelector("select");
    const btn = this.querySelector("button");
    const err = this.querySelector(".error");

    const render = () => {
      select.innerHTML = userState.users
        .map(u => `<option value="${u.id}">${u.username} (${u.id})</option>`)
        .join("");
      btn.disabled = userState.users.length === 0;
    };

    render();
    document.addEventListener("users:updated", render);

    btn.addEventListener("click", async () => {
      err.hidden = true;

      const id = select.value;
      if (!id) return;
      if (!confirm("Delete this user?")) return;

      try {
        await usersActions.deleteUser(root, id);
      } catch (e) {
        err.textContent = e.message;
        err.hidden = false;
      }
    });
  }
}
customElements.define("user-delete", UserDelete);
