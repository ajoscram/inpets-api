const fs = require('fs');
const dotenv = require('dotenv');

console.log('Loading environment variables...');
const strings = JSON.parse(fs.readFileSync('strings.json'));
dotenv.config();
//server variables
const server = {
    PORT: process.env.PORT,
    routes: strings.routes
};

//database variables
const db = {
    URL: process.env.DB_URL,
    NAME: process.env.DB_NAME,
    collections: {
        VETS: process.env.DB_COLLECTION_VETS,
        OWNERS: process.env.DB_COLLECTION_OWNERS,
        VET_SESSIONS: process.env.DB_COLLECTION_VET_SESSIONS,
        OWNER_SESSIONS: process.env.DB_COLLECTION_OWNER_SESSIONS,
        PETS: process.env.DB_COLLECTION_PETS,
        REQUESTS: process.env.DB_COLLECTION_REQUESTS,
        GRANTS: process.env.DB_COLLECTION_GRANTS,
    }
}
//email variables
const email = {
    HOST: process.env.EMAIL_HOST,
    PORT: process.env.EMAIL_PORT,
    SECURE: process.env.EMAIL_SECURE,
    USERNAME: process.env.EMAIL_USERNAME,
    PASSWORD: process.env.EMAIL_PASSWORD,
    FROM: process.env.EMAIL_FROM,
    SUBJECT: process.env.EMAIL_SUBJECT,
}

//errors
const errors = strings.errors;

//constants
const constants = {
    sexes: strings.sexes,
    entry_types: strings.entry_types,
    measures: strings.measures,
    species: strings.species
    //species are arrays with each species' breed
}
console.log('Loaded!');

module.exports = {
    strings,
    server,
    db,
    email,
    errors,
    constants
};