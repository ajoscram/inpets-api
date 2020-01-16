## Welcome

This is the API documentation for inPets, a project developed for the **Introduction to Web Development** course at **ITCR** during summer school 2019-2020. It describes every HTTP request possible in the system, separated by a use case basis. Every request description includes the HTTP method, JSON data required, route, JSON returned and every possible error string it may return on faulty requests.

### Important Links {docsify-ignore}

Below you can find different resources which may be of interest to you:

* [Software Requirements Specification](https://ajoscram.github.io/web-dev/resources/project/SRS.pdf): The document which defines the scope of this API. Written in spanish.
* [Repository](https://github.com/ajoscram/inpets-api): The public GitHub repo for this project.
* [API Link](): Copy this link to access the inPets API server deployed on Heroku. Clicking on it will show this very document you're reading.
* [inPets](): The actual working platform deployed on GitHub pages.

---
## Guide

Read this once to understand what is included on every HTTP method listed. The words **method**, **request** or **route** may all be used interchangeably in this document, and they all refer to the HTTP methods listed below. This is what each one of those will look like:

> ### Method Name {docsify-ignore}
> ##### `HTTP-VERB` /path/to/resource/:parameter/:query? {docsify-ignore}
> ⚠️ `SOME_FLAG` `ANOTHER_FLAG`
>
> This is the method's description.
>
> **Receives:**
>```json
>{
>   "required": string,
>   "JSON": boolean,
>   "object": number
>}
>```
> **Returns:**
>```json
>{
>   "returned": number,
>   "JSON": array,
>   "object": string
>}
>```
> **Errors:**
> * `ERROR`: This is the error's description.
> * `ANOTHER_ERROR_NAME`: This is another error's description.

Important notes on this format:
* Some sections may be omitted if they aren't needed.
* `HTTP-VERB` would be something like `GET`, `POST` or `DELETE`.
* The **:parameter** in the URL is a **wildcard**. This means it can accept any string. Usually, it is used to hold identifiers to resources.
* The **:query?** in the URL is; well, a **query**. More information on HTTP queries can be found [here](https://en.wikipedia.org/wiki/Query_string).
* The ⚠️`FLAGS` listed are just to catch the eye and remind people of important things.
* The **Receives** section specifies a JSON object that must be sent in the request via it's body.
* The **Returns** section specifies a JSON object that will be received from requests if no errors occur.
* Finally, the **Errors** section lists all the errors which could be returned from the method.

### Error Handling

Errors are represented as a JSON comprised of two fields: `success` and `error`.

The `success` field is always false for errors, because it indicates an error occurred. Non-error replies also include this field, but it is always set to true. Clients should always check this field for errors, and present an error when it is set to false. The error field holds any of the error strings described below, under each route's "Errors" section.

Errors look like this:

```json
{
    "success": false,
    "error": string
}
```

There are six special types of error:

* `UNHANDLED_ROUTE`: Triggered when a unhandled route is accessed.
* `NOT_IMPLEMENTED_YET`: The route is not currently implemented.
* `DB_ERROR`: The database or storage services could not be accessed.
* `UNPARSABLE_JSON`: When a JSON is received and it contained syntax errors.
* `INCOMPLETE_JSON`: When a JSON is received and it was parsed successfully but it was missing data.
* `UNKNOWN_SESSION`: The HTTP method called did not receive an authentication session token. If that sounds too cryptic don't worry about it, it will be covered on the next section of this document.

Other errors may occur, on a method by method basis. Take a look at every method's error section in this document to find out what they are. 

It's important to mention that `UNPARSABLE_JSON` and `INCOMPLETE_JSON` are implicit errors in every HTTP method that has a **Receives** section. Same thing goes for `UNKNOWN_SESSION` and methods which ask for session tokens. The rest of the errors in that list are implicit on any method. 

⚠️ **THESE SPECIAL ERRORS WILL NEVER BE ADDED TO THE ERROR SECTION OF ANY METHOD.** ⚠️

A ⚠️ `FLAG` will be added instead to remind you to handle these errors: `RECEIVES` for `UNPARSABLE_JSON` or `INCOMPLETE_JSON`, and `AUTH` for `UNKNOWN_SESSION`.

### Authentication

Some requests require authentication via a session token to be given in the HTML's body to work. When a user logs into **inPets**, the server returns a session token which must be saved in the browser's cookies for future reference. This allows users to stay signed in even after they close the page. When it is sent to the server for authentication it must be embedded in a JSON, which looks like this:

```json
{
    "session": session_token
}
```

Most `POST` requests need a session token to work, because they are sensitive account requests which change the state of the database. Every request flagged with `AUTH` in this document needs to be authenticated, otherwise an `UNKNOWN_SESSION` error is returned.

---
## HTTP Methods

Keep a link to this section, this is it! Every method listed here is accessible through the API.

### Sign-up as a veterinarian
##### `POST` /users/vets/ {docsify-ignore}

⚠️ `RECEIVES`

Adds a new veterinarian user account.

**Receives:**

```json
{
    "name": string,
    "lastname": string,
    "id": number,
    "email": string,
    "vet_code": number,
    "password": string
}
```

**Returns:**

```json
{
    "success": true,
    "added": {
        "name": string,
        "lastname": string,
        "id": number,
        "email": string,
        "vet_code": number,
        "password": string,
        "added": Date //the date when the account was added to the database
    }
}
```

**Errors:**
* `EMAIL_USED`: Email is currently used by another veterinarian account.
* `INCORRECT_EMAIL_FORMAT`: Email is not in the form of person@somewhere.com.
* `INCORRECT_ID`: The ID field is not a 9 digit number.

### Sign-up as a pet owner
##### `POST` /users/owners/ {docsify-ignore}

⚠️ `RECEIVES`

Adds a new pet owner user account.

**Receives:**

```json
{
    "name": string,
    "lastname": string,
    "email": string,
    "password": string
}
```

**Returns:**

```json
{
    "success": true,
    "added": {
        "name": string,
        "lastname": string,
        "email": string,
        "password": string,
        "added": Date //the date when the account was added to the database
    }
}
```

**Errors:**
* `EMAIL_USED`: Email is currently used by another pet owner account.
* `INCORRECT_EMAIL_FORMAT`: Email is not in the form of person@somewhere.com.
* `INCORRECT_ID`: The ID field is not a 9 digit number.

### Log-in as a veterinarian
##### `POST` /users/vets/sessions/ {docsify-ignore}

⚠️ `RECEIVES`

Logs in as a veterinarian. Returns the session token required for a lot of tthe methods listed below. In case you're wondering, yes the password is moved here through plain-text, however HTTPS protects from attacks since it is embedded in the request's body.

**Receives:**

```json
{
    "email": string,
    "password": string
}
```

**Returns:**

```json
{
    "success": true,
    "session": string
}
```

**Errors:**
* `AUTHENTICATION_FAILED`: The email / password pair did not match any other in the veterinarian database.

### Log-in as a pet owner
##### `POST` /users/owners/sessions/ {docsify-ignore}

⚠️ `RECEIVES`

Logs in as a pet owner. Returns the session token required for a lot of tthe methods listed below. In case you're wondering, yes the password is moved here through plain-text, however HTTPS protects from attacks since it is embedded in the request's body.

**Receives:**

```json
{
    "email": string,
    "password": string
}
```

**Returns:**

```json
{
    "success": true,
    "session": string
}
```

**Errors:**
* `AUTHENTICATION_FAILED`: The email / password pair did not match any other in the pet owner database.

### Log-out as a veterinarian
##### `DELETE` /users/vets/sessions/ {docsify-ignore}

⚠️ `RECEIVES` `AUTH`

Logs out as a veterinarian. The session token removed is returned on success.

**Receives:**

```json
{
    "session": string
}
```

**Returns:**

```json
{
    "success": true,
    "session": string
}
```

### Log-out as a pet owner
##### `DELETE` /users/owners/sessions/ {docsify-ignore}

⚠️ `RECEIVES` `AUTH`

Logs out as a pet owner. The session token removed is returned on success.

**Receives:**

```json
{
    "session": string
}
```

**Returns:**

```json
{
    "success": true,
    "session": string
}
```

# 