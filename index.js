const express = require('express');
const port = (4000);
const cors = require('cors');
const knex = require('knex');
const databaseConfig = require('./knexfile').development;

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { Model } = require("objection");
const { response } = require('express');

const app = express()
const database = knex(databaseConfig)
Model.knex(database)

app.use(bodyParser.json())
app.use(cors())

class Product extends Model {
    static tableName = "product"
}

class User extends Model {
    static tableName = "user"
    static relationMappings = {
        products: {
            relation: Model.ManyToManyRelation,
            modelClass: Product,
            join: {
                from: "user.id",
                through: {
                    from: "cart.user_id",
                    to: "cart.product_id",
                },
                to: "product.id",
            }
        }
    }
}


app.get('/users', (_,response) => {
    User.query().withGraphFetched('products')
    .then (users => {
        response.json({ users })
    }).catch(error => {
        console.error(error.message)
        response.sendStatus(500)
    })
})

app.get('/users/:id', authenticate, (request, response) => {
    User.query().withGraphFetched('products')
    .where('id', request.params.id)
    .then(user => response.json(user[0]))
    .catch(error => {
        response.json({ error: error.message })
    });
})

app.post('/users', (request, response) => {
    const { user } = request.body
    bcrypt.hash(user.password, 12)
        .then(hashedPassword => {
            return User.query()
            .insert({
                id: user.id,
                email: user.email,
                password: hashedPassword
                }).returning("*")
        })
        .then (users => {
            const showUser = users
            response.json({ user: showUser })
        }).catch(error => {
            response.json({error: error.message})
        })
})


app.post("/login", (request, response) => {
    const { user } = request.body
    User.query()
    .select()
    .where({ email: user.email })
    .first()
    .then( retrievedUser => {
        if (!retrievedUser) throw new Error("invalid credentials username")
        return Promise.all([
            bcrypt.compare(user.password, retrievedUser.password),
            Promise.resolve(retrievedUser)
        ])
    }).then(results => {
        const arePasswordsTheSame = results[0]
        const user = results[1]
        if(!arePasswordsTheSame) throw new Error("invalid credentials")
        
        const payload = { email: user.email}
        const secret = "SECRETCODE"

        jwt.sign(payload, secret, (error, token) => {
            if (error) throw new Error("unable to login")
            response.json({ token })
        })

    }).catch(error => {
        response.json(error.message)
    })
})

app.get("/welcome", authenticate, (request, response) => {
response.json({ message: `${request.user.email} Successfully logged in`})
})


app.get('/products', (_,response) => {
    Product.query()
    .then (products => {
        response.json({ products })
    })
})

function authenticate(request, response, next){
    const authHeader = request.get("Authorization")
    const token = authHeader.split(" ")[1]
    const secret = "SECRETCODE"
    jwt.verify(token, secret, (error, payload) => {
        if (error) response.json({ error: error.message })

        User.query()
        .select()
        .where({ email: payload.email })
        .first()
        .then(user => {
            request.user = user
            next()
        }).catch(error => {
        response.json({ error: error.message})
        })
    })
}

app.listen(port)




