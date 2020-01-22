const bcrypt = require('bcryptjs');
const generatePassword = require('password-generator');
const db = require('../wrappers/db.js');
const env = require('../wrappers/env.js');
const mailer = require('../wrappers/email.js');

const errors = env.errors;

function validateEmailFormat(email){
    let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

async function get(session_id, collection, sessions_collection){
    if(!session_id)
        throw errors.INCOMPLETE_JSON;
    
    const session = await db.get(sessions_collection, { "_id": db.getObjectID(session_id) });
    if(!session)
        throw errors.UNAUTHORIZED;
        
    const user = await db.get(collection, { "email": session.email });
    if(!user)
        throw errors.UNAUTHORIZED;

    return user;
}

async function login(email, password, collection, sessions_collection){
    if(!email || !password)
        throw errors.INCOMPLETE_JSON;

    const user = await db.get(collection, { "email": email });
    if(!user)
        throw errors.AUTHENTICATION_FAILED;
    
    if(!bcrypt.compareSync(password, user.password))
        throw errors.AUTHENTICATION_FAILED;
    
    const data = {
        "opened": Date(),
        "closed": null,
        "email": email,
        "open": true
    }
    
    return (await db.add(sessions_collection, data))._id;
}

async function logout(session, sessions_collection){
    if(!session)
        throw errors.INCOMPLETE_JSON;
    let filter = { "_id": db.getObjectID(session), "open": true };
    let update = { "open": false, "closed": Date() };
    session = (await db.upget(sessions_collection, filter, { "$set": update }))._id;
    return session;
}

async function changePassword(email, collection){
    if(!email)
        throw errors.UNKNOWN_EMAIL;

    //create password and hash
    const password = generatePassword(20, false);
    const hash = bcrypt.hashSync(password, 10);

    //change password
    const filter = { "email": email };
    const update = { "password": hash };
    await db.update(collection, filter, { "$set": update });

    //send the email with the password
    await mailer.send(password, email);
}

module.exports = {
    get,
    validateEmailFormat,
    login,
    logout,
    changePassword
}