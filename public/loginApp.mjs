import "./components/user-create.mjs";
import "./components/account-manage.mjs";
import { userState } from "./state/userState.mjs";
import { usersActions } from "./logic/usersActions.mjs";

const root = document.querySelector("#app");

root.innerHTML = `
  <h1>User Account</h1>
  <user-create></user-create>
  <account-manage></account-manage>
`;

function updateView() {
  const hasUser = !!userState.currentUserId;
  document.querySelector("user-create").hidden = hasUser;
  document.querySelector("account-manage").hidden = !hasUser;
}

document.addEventListener("session:changed", updateView);
document.addEventListener("users:updated", updateView);

usersActions.loadUsers();
updateView();