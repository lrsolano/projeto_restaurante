const express = require('express')
const consign = require('consign')
const db = require('./config/db')



app = express()
app.db = db

consign()
    .then('./api/validation.js')
    .then('./config/middlewares.js')
    .then('./api')
    .then('./config/routes.js')
    .into(app)



port = 3000
app.use(express.urlencoded({ extended: false }));
app.listen(port, () => {
    console.log("Rodando na porta: " + port)
})