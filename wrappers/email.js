const nodemailer = require('nodemailer');
const info = require('./env.js').email;

let transporter = nodemailer.createTransport({
    "host": info.host,
    "port": info.port,
    "secure": info.secure,
    "auth": {
        "user": info.username,
        "pass": info.password
    }
});

async function send(password, email){
    let options = {
        "from": info.from,
        "to": email,
        "subject": info.subject,
        "text": password
    }
    transporter.sendMail(options, (error, info) => {
        if(error){
            console.log(error);
            throw error;
        }
    });
}

module.exports = {
    send
}