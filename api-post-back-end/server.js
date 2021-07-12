const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const router = require('./routes/user-route.js')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT
    //middleware
app.use(bodyParser.json())
app.use(cors({
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200,
    methods: 'GET,POST'
}))




app.use('/', router)

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`)
})