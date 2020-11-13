# Custom Label Backend

Wear your Words! Show your Colors! Share your Style!

# System technology and dependencies

Node JS with the following dependencies:
"bcrypt": "^5.0.0",
"cors": "^2.8.5",
"express": "^4.17.1",
"jsonwebtoken": "^8.5.1",
"knex": "^0.21.12",
"nodemon": "^2.0.6",
"objection": "^2.2.3",
"pg": "^8.4.2"

# Initial Config
  `npm install`
    express
    nodemon
    knex
    objection
    cors
    bcrypt
    jsonwebtoken
    pg

# Database creation
  create PostGreSQL datatbases with `createdb custom_designer_db`

  in the knexfile.js configure the development section as follows
 ```
 module.exports = {

  development: {
    client: 'pg',
    connection: 'postgres:///custom_designer_db'
  },
};
```
# Database initialization
* Run the command: npx knex migrate:latest
* Run the command: npx knex seed:run


* Run the command: npm start


