import { usersActions } from "../actions/usersActions.mjs";
import { userState } from "../state/userState.mjs";

class UserLogin extends HTMLElement {
  connectedCallback() {
    const tpl = document.querySelector("#tpl-login");
    const node = tpl.content.cloneNode(true);

    this.appendChild(node);

    const form = this.querySelector("form");
    const errorEl = this.querySelector(".error");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();

      const data = new FormData(form);

      const username = data.get("username");
      const password = data.get("password");

      try {
        errorEl.hidden = true;

        const result = await usersActions.login(null, {
          username,
          password
        });

        userState.setCurrentUserId(result.id);

        localStorage.setItem("currentUserId", result.id);

        document.dispatchEvent(new Event("session:changed"));

      } catch (err) {
        errorEl.textContent = err.message;
        errorEl.hidden = false;
      }
    });
  }
}

customElements.define("user-login", UserLogin);