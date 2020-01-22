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

module.exports = {
    add
}