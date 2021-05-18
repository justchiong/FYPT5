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
const { v4: uuidv4 } = require('uuid');
const verifyToken = require('../auth/verifyToken.js');

app.post('/request/parameters', function(req,res){
    var email = req.body.email
    var queriesToUse = req.body.queriesToUse
    request_uuid = uuidv4()
    console.log("test")
    var token = jwt.sign({ requestId: request_uuid, userEmail: email, queries: queriesToUse}, JWT_SECRET.key, {
        expiresIn: 86400 //expires in 24 hrs
    });
    res.json({"requestToken": "Bearer "+ token})
    res.send().status(200)
})

app.get('/request/zipFile',verifyToken, function(req,res){
    var email = req.email
    var queriesToUse = req.queriesToUse
    res.json({"email": email, "queriesToUse": queriesToUse})
    res.send().status(200)
})

module.exports=app;