let users = [];
let currentUserId = null;

export const userState = {
    get users(){ return users; },
    setUsers(nextUsers){
        users = nextUsers;
    },

    get currentUserId() { return currentUserId; },
    setCurrentUserId(id) { currentUserId= id; },
};