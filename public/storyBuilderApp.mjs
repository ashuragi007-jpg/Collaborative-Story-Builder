import "./components/user-create.mjs";
import "./components/user-delete.mjs";
import { usersActions } from "./logic/usersActions.mjs";

const root = document.querySelector("#app");

root.innerHTML = `
  <h1>User Client</h1>

  <user-create></user-create>
  <user-delete></user-delete>

  <button id="getusers">GET /users</button>
  <pre id="out">(loading...)</pre>
  <p id="status"></p>
`;

root.querySelector("#getusers").addEventListener("click", () => {
  usersActions.loadUsers(root).catch(e => {
    root.querySelector("#status").textContent = e.message;
  });
});

usersActions.loadUsers(root);
