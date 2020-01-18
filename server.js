//lib imports
const express = require('express');

//local requires and imports
const env = require('./wrappers/env.js');

//initialize environment variables
const routes = env.server.routes;
const errors = env.errors;
const port = env.server.port;

//express setup
const app = express();
app.use(express.json({limit: '50mb', strict: 'true'}));

//general purpose functions
async function createSuccessfulResponse(name, data = null){
    if(data){
        response = { "success": true };
        response[name] = data;
        return response;
    }
    else
        return { "success": true };
}

async function createUnsuccessfulResponse(error){
    return { "success": false, "error": error };
}

//HTTP routing
app.get(routes.API_DOC, (request, response) => {
    response.redirect("https://ajoscram.github.io/inpets-api/#/");
});

app.get(routes.STRINGS, (request, response) => {
    createSuccessfulResponse("strings", env.strings).then((json) => {
        response.sendFile(json);
    });
});

app.post(routes.VETS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

app.post(routes.OWNERS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

app.post(routes.VETS_SESSIONS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

app.post(routes.OWNERS_SESSIONS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

app.delete(routes.VETS_SESSIONS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

app.delete(routes.OWNERS_SESSIONS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

app.put(routes.VET, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

app.put(routes.OWNER, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

app.post(routes.PETS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

app.get(routes.PET_GENERAL, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

app.get(routes.PET_FILE, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

app.post(routes.PET_FILE, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

app.put(routes.PET_REQUESTS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

app.get(routes.PET_REQUESTS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

app.delete(routes.PET_REQUEST, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

app.post(routes.PET_GRANTS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

app.get(routes.PET_GRANTS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

app.delete(routes.PET_GRANT, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

app.all(routes.ANY, (request, response) => {
    createUnsuccessfulResponse(errors.UNHANDLED_ROUTE).then((json) => {
        response.send(json);
    });
});

app.listen(port, () => console.log("Listening on port " + port + "..."));

//finally connect to the database, and after that open the server for requests
/*dataAccess.connect((error) => {
    if(error){
        console.log(error);
        process.exit(1);
    }
    else
        
});*/