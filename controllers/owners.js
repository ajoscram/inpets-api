const bcrypt = require('bcryptjs')
const db = require('../wrappers/db.js');
const env = require('../wrappers/env.js');

const errors = env.errors;
const OWNERS = env.db.collections.OWNERS;
const SESSIONS = env.db.collections.OWNER_SESSIONS;

function validateEmailFormat(email){
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

async function validate(owner){
    if( !owner.email ||
        !owner.name ||
        !owner.lastname ||
        !owner.password)
        throw errors.INCOMPLETE_JSON;
    if(!validateEmailFormat(owner.email))
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

async function login(email, password){
    if(!email || !password)
        throw errors.INCOMPLETE_JSON;
    
    const owner = await db.get(OWNERS, { "email": email });
    if(!owner)
        throw errors.AUTHENTICATION_FAILED;
    
    if(!bcrypt.compareSync(password, owner.password))
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