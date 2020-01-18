const fs = require('fs');
const dotenv = require('dotenv');

console.log('Reading strings.json file...');
const strings = JSON.parse(fs.readFileSync('strings.json'));
console.log('Read!');
console.log('Loading environment variables...');
dotenv.config();
//server variables
const server = {
    port: process.env.PORT,
    routes: strings.routes
};
//database variables
//email variables
//errors
const errors = strings.errors;
//constants
const constants = {
    sexes: strings.sexes,
    entry_types: strings.entry_types,
    measures: strings.measures,
    species: strings.species
}
console.log('Loaded!');

module.exports = {
    strings,
    server,
    errors,
    constants
};