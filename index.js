const express = require('express')
const port = (4000)
const cors = require('cors')
const knex = require('knex')
const databaseConfig = require('./knexfile.js').development

const app = express()
const database = knex(databaseConfig)

app.use(cors())


app.get('/users', (_,response) => {
    response.json({ user: 'hello'})
})

app.get('/', (_, response) => {
    response.json({message: 'created'})
})
app.listen(port)