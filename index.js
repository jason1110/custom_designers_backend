const express = require('express')
const port = (4000)
const cors = require('cors')
const knex = require('knex')
const databaseConfig = require('./knexfile').development

const { Model } = require("objection")

const app = express()
const database = knex(databaseConfig)
Model.knex(database)

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