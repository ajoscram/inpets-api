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

//HTTP ROUTING

//get api doc
app.get(routes.API_DOC, (request, response) => {
    response.redirect("https://ajoscram.github.io/inpets-api/#/");
});

//Get strings.json
app.get(routes.STRINGS, (request, response) => {
    createSuccessfulResponse("strings", env.strings).then((json) => {
        response.sendFile(json);
    });
});

//Sign-up as a veterinarian
app.post(routes.VETS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

//Sign-up as a pet owner
app.post(routes.OWNERS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

//Log-in as a veterinarian
app.post(routes.VETS_SESSIONS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

//Log-in as a pet owner
app.post(routes.OWNERS_SESSIONS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

//Log-out as a veterinarian
app.delete(routes.VETS_SESSIONS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

//Log-out as a pet owner
app.delete(routes.OWNERS_SESSIONS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

//Change password as a veterinarian
app.put(routes.VET, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

//Change password as a pet owner
app.put(routes.OWNER, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

//Add pet
app.post(routes.PETS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

//Get a pet's basic information
app.get(routes.PET_GENERAL, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

//Get a pet's complete file
app.get(routes.PET_FILE, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

//Add an entry to a pet's file
app.post(routes.PET_FILE, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

//Request pet access
app.put(routes.PET_REQUESTS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

//Get pet access requests
app.get(routes.PET_REQUESTS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

//Remove a pet access request
app.delete(routes.PET_REQUEST, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

//Grant access to a pet's file
app.post(routes.PET_GRANTS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

//Get access grants to a pet's file
app.get(routes.PET_GRANTS, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

//Revoke access to a pet's file
app.delete(routes.PET_GRANT, (request, response) => {
    createUnsuccessfulResponse(errors.NOT_IMPLEMENTED_YET).then((json) => {
        response.send(json);
    });
});

//any other rounte
app.all(routes.ANY, (request, response) => {
    createUnsuccessfulResponse(errors.UNHANDLED_ROUTE).then((json) => {
        response.send(json);
    });
});

//Connecting to the database, and opening the server for requests
app.listen(port, () => console.log("Listening on port " + port + "..."));
/*dataAccess.connect((error) => {
    if(error){
        console.log(error);
        process.exit(1);
    }
    else
        
});*/