var imgur = require('imgur');
var error = require('./env.js').errors.IMGUR_ERROR;

async function upload(image){
    try{
        return (await imgur.uploadBase64(image)).data.link;
    } catch(imgur_error){
        console.error(imgur_error.message);
        throw error;
    }
}

module.exports = {
    upload
};