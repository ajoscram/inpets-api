const bcrypt = require('bcryptjs')
const db = require('../wrappers/db.js');
const env = require('../wrappers/env.js');
const users = require('./users.js');

const errors = env.errors;
const VETS = env.db.collections.VETS;
const SESSIONS = env.db.collections.VET_SESSIONS;

function validateCountryID(country_id){
    return country_id.toString().length == 9;
}

async function validate(vet){
    if( !vet.email ||
        !vet.name ||
        !vet.lastname ||
        !vet.country_id ||
        !vet.vet_code ||
        !vet.password)
        throw errors.INCOMPLETE_JSON;
    if(!users.validateEmailFormat(vet.email))
        throw errors.INCORRECT_EMAIL_FORMAT;
    else if(!validateCountryID(vet.country_id))
        throw errors.INCORRECT_COUNTRY_ID;
    else if (await db.get(VETS, { email: vet.email }) )
        throw errors.EMAIL_USED;
}

async function add(vet){
    if(!vet)
        throw errors.INCOMPLETE_JSON;
    else{
        let data = {
            email: vet.email,
            name: vet.name,
            lastname: vet.lastname,
            country_id: vet.country_id,
            vet_code: vet.vet_code,
            password: vet.password
        };

        await validate(data);
        data.password = bcrypt.hashSync(data.password, 10);
        return await db.add(VETS, data);
    }
}

async function login(email, password){
    return await users.login(email, password, VETS, SESSIONS);
}

async function logout(session){
    return await users.logout(session, SESSIONS);
}

async function changePassword(email){
    return await users.changePassword(email, VETS);
}

module.exports = {
    add,
    login,
    logout,
    changePassword
}