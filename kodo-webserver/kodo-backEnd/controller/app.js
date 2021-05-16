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
// const JWT_SECRET = require("../config.js"); 
// jwt = require('jsonwebtoken')

app.get('/test', function(req,res){
    res.sendStatus(200)
})

module.exports=app; 