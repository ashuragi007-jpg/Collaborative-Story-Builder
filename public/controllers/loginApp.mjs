import "../components/user-login.mjs";
import "../components/user-create.mjs";
import "../components/account-manage.mjs";
import { userState } from "../state/userState.mjs";
import { usersActions } from "../actions/usersActions.mjs";
import { loadTranslations } from "../utils/translate.mjs";

await loadTranslations();

const root = document.querySelector("#app");

const savedUserId = localStorage.getItem("currentUserId");

if (savedUserId) {
  userState.setCurrentUserId(savedUserId);
}

root.innerHTML = `
  <user-login></user-login>
  <user-create></user-create>
  <account-manage></account-manage>
`;

function updateView() {
  const hasUser = !!userState.currentUserId;

  document.querySelector("user-login").hidden = hasUser;
  document.querySelector("user-create").hidden = hasUser;
  document.querySelector("account-manage").hidden = !hasUser;
}

document.addEventListener("session:changed", updateView);
document.addEventListener("users:updated", updateView);

usersActions.loadUsers();
updateView();