const bcrypt = require('bcryptjs')
const db = require('../wrappers/db.js');
const env = require('../wrappers/env.js');

const errors = env.errors;
const VETS = env.db.collections.VETS;
const SESSIONS = env.db.collections.VET_SESSIONS;

function validateEmailFormat(email){
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

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
    if(!validateEmailFormat(vet.email))
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
    if(!email || !password)
        throw errors.INCOMPLETE_JSON;
    
    const vet = await db.get(VETS, { "email": email });
    if(!vet)
        throw errors.AUTHENTICATION_FAILED;
    
    if(!bcrypt.compareSync(password, vet.password))
        throw errors.AUTHENTICATION_FAILED;
    
    const data = {
        "opened": Date(),
        "closed": null,
        "email": email,
        "open": true
    }
    
    return (await db.add(SESSIONS, data))._id;
}

async function logout(session){
    if(!session)
        throw errors.INCOMPLETE_JSON;
    let filter = { "_id": db.getObjectID(session), "open": true };
    let update = { "open": false, "closed": Date() }
    session = (await db.upget(SESSIONS, filter, { "$set": update }))._id;
    return session;
}

module.exports = {
    add,
    login,
    logout
}