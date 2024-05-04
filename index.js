
const connectToMongo = require("./db");
require("dotenv").config();

const express = require('express')
var cors = require("cors");
const app = express()
const port = process.env.PORT || 5000


app.use(cors())
var bodyParser = require('body-parser');
app.use(bodyParser.json({limit: "50mb"})); //!Necessary to be able to upload large images
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
connectToMongo();


app.use('/api/auth', require("./routes/Auth"));

app.listen(port, () => {
    console.log(`[+] Listening on port ${port}...`)
})