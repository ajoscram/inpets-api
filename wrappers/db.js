const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const env = require('./env.js');

const database = {
    url: env.db.URL,
    name: env.db.NAME,
    options: { useUnifiedTopology: true },
    instance: null
}

async function connect(){
    if(!database.instance){
        try{
            console.log('Connecting to the database...');
            const client = new MongoClient(database.url, database.options);
            await client.connect();
            console.log('Connected!');
            database.instance = client.db(database.name);
        } catch(error) {
            console.log(error);
            throw env.errors.DB_ERROR;
        }
    }else{
        console.log("Already connected!");
    }
}

async function get(collection, filter){
    try{
        return await database.instance.collection(collection).findOne(filter);
    } catch(mongo_error){
        console.log(mongo_error);
        throw env.errors.DB_ERROR;
    }
}

async function query(collection, filter){
    try{
        return await database.instance.collection(collection).find(filter).toArray();
    } catch(mongo_error){
        console.log(mongo_error);
        throw env.errors.DB_ERROR;
    }
}

async function add(collection, object){
    try{
        return (await database.instance.collection(collection).insertOne(object)).ops[0];
    } catch(mongo_error){
        console.log(mongo_error);
        throw env.errors.DB_ERROR;
    }
}

async function update(collection, filter, operations){
    try{
        return await database.instance.collection(collection).updateOne(filter, operations);
    } catch(mongo_error){
        console.log(mongo_error);
        throw env.errors.DB_ERROR;
    }
}

//add or update
async function addup(collection, operations, filter){
    try{
        return await database.instance.collection(collection).updateOne(filter, operations, {upsert: true});
    } catch(mongo_error){
        console.log(mongo_error);
        throw env.errors.DB_ERROR;
    }
}

//update and get
async function upget(collection, filter, operations){
    try{
        return await database.instance.collection(collection).findOneAndUpdate(filter, operations);
    } catch(mongo_error){
        console.log(mongo_error);
        throw env.errors.DB_ERROR;
    }
}

async function count(collection, filter){
    try{
        return await database.instance.collection(collection).countDocuments(filter);
    } catch(mongo_error){
        console.log(mongo_error);
        throw env.errors.DB_ERROR;
    }
}

//WARNING! RETURNS NULL ON FUCK UP!
function getObjectID(_id){
    let oid = null;
    try{ oid = ObjectID(_id); }catch(error){}
    return oid;
}

module.exports = {
    connect,
    get,
    query,
    add,
    update,
    addup,
    upget,
    count,
    getObjectID
}