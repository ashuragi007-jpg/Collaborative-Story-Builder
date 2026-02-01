const Users = {};

function user(){
    return {
        id: null,
        username: null,
        passwordHash: null,
        consent: {
            ToSAcceptedAt: null,
            consentVersion: "1.0"
        }
    };
}

export function generateID(){
    let id = null;
    do {
        id = (Math.random() * Number.MAX_SAFE_INTEGER).toString(16);
    } while (Users[id]);

    return id;
}


export default user