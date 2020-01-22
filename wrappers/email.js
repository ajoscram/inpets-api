const nodemailer = require('nodemailer');
const info = require('./env.js').email;

async function send(password, email){

    const transport = nodemailer.createTransport({
        "host": info.HOST,
        "port": info.PORT,
        "secure": info.SECURE,
        "auth": {
            "user": info.USERNAME,
            "pass": info.PASSWORD
        }
    });

    const result = await transport.sendMail({
            "from": info.FROM,
            "to": email,
            "subject": info.SUBJECT,
            "html": "<h3>Su contraseña nueva es:</h3><br><br>" + password
    });
}

module.exports = {
    send
}