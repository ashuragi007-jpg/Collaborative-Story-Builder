const root = document.querySelector("#app");

const state = { users: [] };

root.innerHTML = `
  <h1>User Client</h1>

  <user-create></user-create>

  <button id="getusers">GET/ Users</button>
  <pre id="out">(loading...)</pre>
  <p id="status"></p>
`;


async function api(path, { method = "GET", body } = {}) { 
    const res = await fetch (path, {
        method, 
            headers: body ? { "Content-type": "application/json" } : undefined,
            body: body ? JSON.stringify(body) : undefined
    });

    if (res.status === 204) return null;

    const data = await res.json().catch(() => null);

    if (!res.ok){
        throw new Error(data?.error || `Request failed (${res.status})`);
    }

    return data;
}

async function loadUsers() {
  state.users = await api("/users");
  render();
}

function render() {
  root.querySelector("#out").textContent = JSON.stringify(state.users, null, 2);
  root.querySelector("#status").textContent = `Users: ${state.users.length}`;
}

root.querySelector("#getusers").addEventListener("click", () => {
  loadUsers().catch(err => {
    root.querySelector("#status").textContent = err.message;
  });
});


loadUsers();

class UserCreate extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="card">
        <h2>Create user</h2>
        <form class="row">
          <input name="username" placeholder="Username" required />
          <input name="password" type="password" placeholder="Password" required />
          <label class="row">
            <input type="checkbox" name="tos" />
            Accept ToS
          </label>
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

      const username = form.username.value.trim();
      const password = form.password.value;
      const ToSAccepted = form.tos.checked;

      try {
        await api("/users", {
          method: "POST",
          body: { username, password, ToSAccepted, consentVersion: "1.0" }
        });

        form.reset();
        await loadUsers(); 
      } catch (e) {
        err.textContent = e.message;
        err.hidden = false;
      }
    });
  }
}

customElements.define("user-create", UserCreate);
