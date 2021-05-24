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


var storages = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './zipFiles/');
     },
    filename: function(req, file, callback) {
        callback(null, req.uuid +".zip");
    }
});
var upload = multer({storage: storages,
        fileFilter: function(req, file, callback){
            req.valid = file.mimetype == "application/x-zip-compressed"
            return callback(null, file.mimetype == "application/x-zip-compressed")
        }
    });

app.post('/request/parameters', function(req,res){
    var email = req.body.email  
    var queriesToUse = req.body.queriesToUse
    request_uuid = uuidv4()
    var token = jwt.sign({ requestId: request_uuid, userEmail: email, queries: queriesToUse}, JWT_SECRET.key, {
        expiresIn: 86400 //expires in 24 hrs
    });
    console.log(`Token created with request UUID of ${request_uuid}`)
    res.json({"requestToken": token})
    res.send().status(200)
})

app.post('/request/zipFile',verifyToken, upload.single('zipFile'), function(req,res){
    if(!req.valid){
        console.log(req.valid)
        res.status(422).send("Wrong file type, only zip files are accepted.")
        return
    }
    console.log(`Zip file of request UUID ${req.uuid} received and stored.`)
    res.sendStatus(200)
})
module.exports=app;