import "./components/user-create.mjs";
import "./components/user-delete.mjs";
import "./components/user-edit.mjs";
import "./components/account-manage.mjs";
import { usersActions } from "./logic/usersActions.mjs";
import { userState } from "./state/userState.mjs";

const root = document.querySelector("#app");

root.innerHTML = `
  <h1>User Client</h1>
  <account-manage></account-manage>
  <user-create></user-create>
`;

function updateView() {
    const hasUser = !!userState.currentUserId;

    const createComp = document.querySelector("user-create");
    const manageComp = document.querySelector("account-manage");

    if (createComp) createComp.hidden = hasUser;
    if (manageComp) manageComp.hidden = !hasUser;
}

document.addEventListener("session:changed", updateView);
document.addEventListener("users:updated", updateView);
updateView();


usersActions.loadUsers(root);
