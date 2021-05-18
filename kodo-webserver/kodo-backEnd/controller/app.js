var express=require('express');
var app=express();
// var fs = require('fs');

var bodyParser=require('body-parser');
var urlencodedParser=bodyParser.urlencoded({extended:false});
const cors = require("cors");
app.use(bodyParser.json())
app.use(cors());


// var kodoDB=require('../model/model.js');
// var verifyToken = require('../auth/verifyToken.js');
// var verifyAdmin = require('../auth/verifyAdmin.js');
const JWT_SECRET = require("../auth/config.js"); 
const jwt = require('jsonwebtoken')

app.post('/request/parameters', function(req,res){
    var email = req.body.email
    var queriesToUse = req.body.queriesToUse
    console.log(queriesToUse)
    console.log(email)
    var token
    res.sendStatus(200)
})

module.exports=app;