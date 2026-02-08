const root = document.querySelector("#app");

const state = { users: [] };

root.innerHTML = `
  <h1>User Client</h1>

  <user-create></user-create>
  <user-delete></user-delete>

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
  const data = await api("/users");
  state.users = Array.isArray(data) ? data : (data?.users ?? []);
  renderUsers();

  document.dispatchEvent(new CustomEvent("users:updated"));
}


function renderUsers() {
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

class UserDelete extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <section class="card">
        <h2>Delete user</h2>
        <div class="row">
          <select id="userSelect"></select>
          <button id="deleteBtn">Delete</button>
        </div>
        <p class="error" hidden></p>
      </section>
    `;

    const select = this.querySelector("#userSelect");
    const btn = this.querySelector("#deleteBtn");
    const err = this.querySelector(".error");

    const renderOptions = () => {
      select.innerHTML = state.users.map(u =>
        `<option value="${u.id}">${u.username} (${u.id})</option>`
      ).join("");

      btn.disabled = state.users.length === 0;
    };

    renderOptions();

    document.addEventListener("users:updated", renderOptions);

    btn.addEventListener("click", async () => {
      err.hidden = true;

      const id = select.value;
      if (!id) return;

      const confirmed = confirm("Are you sure you want to delete this user?");
      if (!confirmed) return;

      try {
        await api(`/users/${id}`, { method: "DELETE" });
        await loadUsers();
      } catch (e) {
        err.textContent = e.message;
        err.hidden = false;
      }
    });
  }
}

customElements.define("user-delete", UserDelete);


