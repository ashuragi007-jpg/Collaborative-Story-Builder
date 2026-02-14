import { usersActions } from "../logic/usersActions.mjs";

const root = document.querySelector("#app");

class UserCreate extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="card">
        <h2>Create user</h2>
        <form class="row">
          <input name="username" placeholder="Username" required />
          <input name="password" type="password" placeholder="Password" required />
          <label class="row"><input type="checkbox" name="tos" /> Accept ToS</label>
          <button>Create</button>
        </form>
        <p class="error" hidden></p>
      </section>
    `;

    const form = this.querySelector("form");
    const err = this.querySelector(".error");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      err.hidden = true;

      try {
        await usersActions.createUser(root, {
          username: form.username.value.trim(),
          password: form.password.value,
          ToSAccepted: form.tos.checked,
        });
        form.reset();
      } catch (e) {
        err.textContent = e.message;
        err.hidden = false;
      }
    });
  }
}
customElements.define("user-create", UserCreate);