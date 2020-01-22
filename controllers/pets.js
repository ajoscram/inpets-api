const db = require('../wrappers/db.js');
const env = require('../wrappers/env.js');
const imgur = require('../wrappers/imgur.js');

const PETS = env.db.collections.PETS;
const REQUESTS = env.db.collections.REQUESTS;
const GRANTS = env.db.collections.GRANTS;

const errors = env.errors;
const sexes = env.constants.sexes;
const species = env.constants.species;

async function validate(pet){
    if( !pet.name ||
        !pet.description ||
        !pet.sex ||
        !pet.birthday ||
        !pet.species ||
        !pet.breed ||
        !pet.image)
        throw errors.INCOMPLETE_JSON;
    else if(!sexes.includes(pet.sex))
        throw errors.UNKNOWN_SEX;
    else if(!Object.keys(species).includes(pet.species))
        throw errors.UNKNOWN_SPECIES;
    else if(!species[pet.species].includes(pet.breed))
        throw errors.UNKNOWN_BREED;
}

async function add(pet, owner_email){
    if(!pet)
        throw errors.INCOMPLETE_JSON;
    let data = {
        name: pet.name,
        description: pet.description,
        sex: pet.sex,
        birthday: pet.birthday,
        species: pet.species,
        breed: pet.breed,
        image: pet.image
    };

    await validate(data);
    data.image = await imgur.upload(pet.image);
    data.owner = owner_email;
    return await db.add(PETS, data);
}

async function get(id, filter){
    if(!id)
        throw errors.INCOMPLETE_JSON;
    filter._id = db.getObjectID(id);
    console.log(filter);
    const pet = await db.get(PETS, filter);
    if(!pet)
        throw errors.UNKNOWN_PET_ID;
    return pet;
}

module.exports = {
    add,
    get
}