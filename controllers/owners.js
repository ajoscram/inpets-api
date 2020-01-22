const bcrypt = require('bcryptjs');
const db = require('../wrappers/db.js');
const env = require('../wrappers/env.js');
const users = require('./users.js');

const errors = env.errors;
const OWNERS = env.db.collections.OWNERS;
const SESSIONS = env.db.collections.OWNER_SESSIONS;

async function validate(owner){
    if( !owner.email ||
        !owner.name ||
        !owner.lastname ||
        !owner.password)
        throw errors.INCOMPLETE_JSON;
    if(!users.validateEmailFormat(owner.email))
        throw errors.INCORRECT_EMAIL_FORMAT;
    else if (await db.get(OWNERS, { email: owner.email }) )
        throw errors.EMAIL_USED;
}

async function add(owner){
    if(!owner)
        throw errors.INCOMPLETE_JSON;
    else{
        let data = {
            email: owner.email,
            name: owner.name,
            lastname: owner.lastname,
            password: owner.password
        };

        await validate(data);
        data.password = bcrypt.hashSync(data.password, 10);
        return await db.add(OWNERS, data);
    }
}

async function get(session){
    return await users.get(session, OWNERS, SESSIONS);
}

async function login(email, password){
    console.log(email + " " + password);
    console.log(OWNERS + " " +SESSIONS);
    return await users.login(email, password, OWNERS, SESSIONS);
}

async function logout(session){
    return await users.logout(session, SESSIONS);
}

async function changePassword(email){
    return await users.changePassword(email, OWNERS);
}

module.exports = {
    add,
    get,
    login,
    logout,
    changePassword
}