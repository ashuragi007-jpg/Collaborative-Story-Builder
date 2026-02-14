let users = [];

export const userState = {
    get users(){
        return users;
    },

    setUsers(nextUsers){
        users = nextUsers;
    }
};