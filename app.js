const express = require('express');
require('./mongoDb');   // here require the connection from mongoDb file
const cookie = require('cookie-parser');
const app = express();
app.use(express.json());    // use for getting json data from body
const cors = require('cors');
const router = require('./routers'); 
app.use(express.urlencoded({ extended: false })); //use for getting data from form-post method
app.set('view engine', 'ejs');  // for ejs file loading
const path = require('path');
// app.use(express.static(path.join(__dirname, 'public')));
app.use( express.static( "public" ) );  //for setting up folder for uploading/rendering files...
app.use(cookie());

// Cors Module use for Run API in Front-End Server.... Here origin is front-end server port...
app.use(cors({
    origin:" http://localhost:4200",
}))

app.use('/',router);
app.listen(7000);
