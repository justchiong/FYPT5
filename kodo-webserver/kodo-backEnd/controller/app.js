var express=require('express');
var app=express();
// var fs = require('fs');

var bodyParser=require('body-parser');
var urlencodedParser=bodyParser.urlencoded({extended:false});
const cors = require("cors");
app.use(bodyParser.json())
app.use(cors());


// var kodoDB=require('../model/model.js');
const JWT_SECRET = require("../auth/config.js"); 
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
const verifyToken = require('../auth/verifyToken.js');
var multer = require('multer');

function validateFile(req, file){
    console.log(file.mimetype)
    return file
}
var storages = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, '../zipFiles/');
     },
    filename: function(req, file, callback) {
        callback(null, req.uuid +".zip");
    },
    fileFilter: function(req, file, callback){
        callback(null, validateFile())
    }
});
var upload = multer({storage: storages});

app.post('/request/parameters', function(req,res){
    var email = req.body.email
    var queriesToUse = req.body.queriesToUse
    request_uuid = uuidv4()
    var token = jwt.sign({ requestId: request_uuid, userEmail: email, queries: queriesToUse}, JWT_SECRET.key, {
        expiresIn: 86400 //expires in 24 hrs
    });
    console.log("Token Created")
    console.log(token)
    res.json({"requestToken": token})
    res.send().status(200)
})

app.post('/request/zipFile',verifyToken, upload.single('zipFile'), function(req,res){
    var email = req.email
    var queriesToUse = req.queriesToUse
    console.log(req.file)
    res.json({"email": email, "queriesToUse": queriesToUse})
    res.send().status(200)
})
module.exports=app;