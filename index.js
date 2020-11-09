const express = require('express');
const port = (4000);
const cors = require('cors');
const knex = require('knex');
const databaseConfig = require('./knexfile').development;

const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
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

app.get('/users/:id', (request, response) => {
    User.query().withGraphFetched('products')
    .where('id', request.params.id)
    .then(user => response.json(user[0]))
    .catch(error => {
        response.json({error: error.message
        })
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
        const user = users[0]
        response.json({ user })
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
        return bcrypt.compare(user.password, retrievedUser.password)
    }).then(arePasswordsTheSame => {
        if(!arePasswordsTheSame) throw new Error("invalid credentials")
        
        response.json({ message: 'everything matches'})
    }).catch(error => {
        response.json(error.message)
    })
})

app.get('/products', (_,response) => {
    Product.query()
    .then (products => {
        response.json({ products })
    })
})

app.get('/', (_, response) => {
    response.json({message: 'created'})
})
app.listen(port)




