import { usersActions } from "../logic/usersActions.mjs";
import { userState } from "../state/userState.mjs";

class UserCreate extends HTMLElement {
  connectedCallback() {
    const tpl = document.getElementById("tpl-user-create");
    this.replaceChildren(tpl.content.cloneNode(true));

    const root = document.querySelector("#app");
    const form = this.querySelector("form");
    const err = this.querySelector(".error");

    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      err.hidden = true;

      try {
        const created = await usersActions.createUser(root, {
          username: form.username.value.trim(),
          password: form.password.value,
          ToSAccepted: form.tos.checked,
        });

        userState.setCurrentUserId(created.id);
        document.dispatchEvent(new Event("session:changed"));

        form.reset();
      } catch (e) {
        err.textContent = e.message;
        err.hidden = false;
      }
    });
  }
}

customElements.define("user-create", UserCreate);