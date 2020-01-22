//lib imports
const express = require('express');
const cors = require('cors');

//local requires and imports
const env = require('./wrappers/env.js');
const db = require('./wrappers/db.js');

//controllers
const vets = require('./controllers/vets.js');
const owners = require('./controllers/owners.js');
const pets = require('./controllers/pets.js');

//initialize environment variables
const routes = env.server.routes;
const errors = env.errors;
const port = env.server.PORT;

//general purpose functions
async function createSuccessfulResponse(name = null, data = null){
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

//middleware
function validateJSON(error, request, response, next){
    if(error instanceof SyntaxError)
        createUnsuccessfulResponse(errors.UNPARSABLE_JSON).then((json) => {
            response.send(json);
        });
    else
        next();
}

//midddleware for authentication
function authenticateOwner(request, response, next){
    owners.get(request.body.session).then(owner => {
        request.body.owner = owner;
        next();
    }).catch(error => {
        createUnsuccessfulResponse(error).then(json => {
            response.send(json);
        });
    });
}
function authenticateVet(request, response, next){
    vets.get(request.body.session).then(vet => {
        request.body.vet = vet;
        next();
    }).catch(error => {
        createUnsuccessfulResponse(error).then(json => {
            response.send(json);
        });
    });
}

//express setup
const app = express();
app.use(cors());
app.use(express.json({ limit: '50mb', strict: 'true' }));
app.use(validateJSON);

//http routing

//Get API doc
app.get(routes.API_DOC, (request, response) => {
    response.redirect("https://ajoscram.github.io/inpets-api/#/");
});

//Get strings.json
app.get(routes.STRINGS, (request, response) => {
    createSuccessfulResponse("strings", env.strings).then((json) => {
        response.send(json);
    });
});

//Sign-up as a veterinarian
app.post(routes.VETS, (request, response) => {
    vets.add(request.body.vet)
        .then(added => { return createSuccessfulResponse("vet", added); })
        .catch(error => { return createUnsuccessfulResponse(error); })
        .then(json => { response.send(json); });
});

//Sign-up as a pet owner
app.post(routes.OWNERS, (request, response) => {
    owners.add(request.body.owner)
        .then(added => { return createSuccessfulResponse("owner", added); })
        .catch(error => { return createUnsuccessfulResponse(error); })
        .then(json => { response.send(json); });
});

//Log-in as a veterinarian
app.post(routes.VETS_SESSIONS, (request, response) => {
    vets.login(request.body.email, request.body.password)
        .then(added => { return createSuccessfulResponse("session", added); })
        .catch(error => { return createUnsuccessfulResponse(error); })
        .then(json => { response.send(json); });
});

//Log-in as a pet owner
app.post(routes.OWNERS_SESSIONS, (request, response) => {
    owners.login(request.body.email, request.body.password)
        .then(added => { return createSuccessfulResponse("session", added); })
        .catch(error => { return createUnsuccessfulResponse(error); })
        .then(json => { response.send(json); });
});

//Log-out as a veterinarian
app.delete(routes.VETS_SESSIONS, (request, response) => {
    vets.logout(request.body.session)
        .then(removed => { return createSuccessfulResponse("session", removed); })
        .catch(error => { return createUnsuccessfulResponse(error); })
        .then(json => { response.send(json); });
});

//Log-out as a pet owner
app.delete(routes.OWNERS_SESSIONS, (request, response) => {
    owners.logout(request.body.session)
        .then(removed => { return createSuccessfulResponse("session", removed); })
        .catch(error => { return createUnsuccessfulResponse(error); })
        .then(json => { response.send(json); });
});

//Change password as a veterinarian
app.put(routes.VET, (request, response) => {
    vets.changePassword(request.params.email)
        .then(() => { return createSuccessfulResponse(); })
        .catch(error => { return createUnsuccessfulResponse(error); })
        .then(json => { response.send(json); });
});

//Change password as a pet owner
app.put(routes.OWNER, (request, response) => {
    owners.changePassword(request.params.email)
        .then( () => { return createSuccessfulResponse(); })
        .catch(error => { return createUnsuccessfulResponse(error); })
        .then(json => { response.send(json); });
});

//Add pet
app.post(routes.PETS, authenticateOwner, (request, response) => {
    pets.add(request.body.pet, request.body.owner.email)
        .then(added => { return createSuccessfulResponse("pet", added); })
        .catch(error => { return createUnsuccessfulResponse(error); })
        .then(json => { response.send(json); });

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

db.connect()
    .then(() => {
        app.listen(port, () => console.log("Listening on port " + port + "..."));
    })
    .catch((error) => {
        console.log(error);
    });