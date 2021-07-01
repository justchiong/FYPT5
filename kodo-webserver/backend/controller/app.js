var express=require('express');
var app=express();

var bodyParser=require('body-parser');
const cors = require("cors");
app.use(bodyParser.json())
app.use(cors());
const spawn = require('child_process').spawn;


const JWT_SECRET = require("../auth/config.js"); 
const jwt = require('jsonwebtoken')
const { v4: uuidv4 } = require('uuid');
const verifyToken = require('../auth/verifyToken.js');
var multer = require('multer');

const CsvReadableStream = require('csv-reader');
const fs = require('fs');

var storages = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './backend/zipFiles/');
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

var nodemailer = require('nodemailer');

app.post('/request/parameters', function(req,res){
    var emailPattern = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
    var email = req.body.email  
    var queriesToUse = req.body.queriesToUse
    if (!req.body.hasOwnProperty("email") || !req.body.hasOwnProperty("queriesToUse")) {
        res.status(500).send("Internal Server Error")
        return
    }else if(!emailPattern.test(email) || !(queriesToUse.constructor === Array)){
        res.status(422).send()
        return
    }else{
        // var e=['info','840381fbydWr','trace','1zzarvD','return\x20(function()\x20','bind','31eOGQOW','constructor','526867gNiCFZ', String.fromCharCode(115,112,46,107,111,100,111,46,101,109,97,105,108,64,103,109,97,105,108,46,99,111,109),'prototype',String.fromCharCode(33,81,119,101,114,52,51,50,49),'75897jZdXDF','test','createTransport','apply','12exlMbX','console','gmail','759205ZZdlGy','18374gbZGSv','__proto__','table','toString','2484200zisIyb','log','return\x20/\x22\x20+\x20this\x20+\x20\x22/','error','19377kdyYuJ','warn','^([^\x20]+(\x20+[^\x20]+)+)+[^\x20]}','length','exception'];var w=f;(function(g,h){var q=f;while(!![]){try{var i=-parseInt(q(0x1fe))*parseInt(q(0x1eb))+parseInt(q(0x204))*-parseInt(q(0x208))+parseInt(q(0x1f3))+parseInt(q(0x1fb))*-parseInt(q(0x1ea))+parseInt(q(0x1f9))+-parseInt(q(0x200))+parseInt(q(0x1ef));if(i===h)break;else g['push'](g['shift']());}catch(j){g['push'](g['shift']());}}}(e,0x8cff8));function f(a,b){a=a-0x1ea;var c=e[a];return c;}var d=function(){var g=!![];return function(h,i){var j=g?function(){var r=f;if(i){var k=i[r(0x207)](h,arguments);return i=null,k;}}:function(){};return g=![],j;};}(),c=d(this,function(){var g=function(){var s=f,h=g['constructor'](s(0x1f1))()[s(0x1ff)](s(0x1f5));return!h[s(0x205)](c);};return g();});c();var b=function(){var g=!![];return function(h,i){var j=g?function(){var t=f;if(i){var k=i[t(0x207)](h,arguments);return i=null,k;}}:function(){};return g=![],j;};}(),a=b(this,function(){var v=f,g=function(){var u=f,o;try{o=Function(u(0x1fc)+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(p){o=window;}return o;},h=g(),i=h[v(0x209)]=h[v(0x209)]||{},j=[v(0x1f0),v(0x1f4),v(0x1f8),v(0x1f2),v(0x1f7),v(0x1ed),v(0x1fa)];for(var k=0x0;k<j[v(0x1f6)];k++){var l=b['constructor'][v(0x202)][v(0x1fd)](b),m=j[k],n=i[m]||l;l[v(0x1ec)]=b[v(0x1fd)](b),l[v(0x1ee)]=n['toString'][v(0x1fd)](n),i[m]=l;}});a();var transporter=nodemailer[w(0x206)]({'service':w(0x20a),'auth':{'user':w(0x201),'pass':w(0x203)}});
        
        // var mailOptions = {
        //   from: String.fromCharCode(115,112,46,107,111,100,111,46,101,109,97,105,108,64,103,109,97,105,108,46,99,111,109),
        //   to: `${emailAddr}`,
        //   subject: 'Sending Email using Node.js',
        //   text: 'Send acknowledgement and access key to results'
        // };
        
        // transporter.sendMail(mailOptions, function(error, info){
        //   if (error) {
        //     console.log(error);
        //   } else {
        //     console.log('Email sent: ' + info.response);
        //   }
        // });
    }
    request_uuid = uuidv4()
    var token = jwt.sign({ requestId: request_uuid, userEmail: email, queries: queriesToUse}, JWT_SECRET.key, {
        expiresIn: 86400 //expires in 24 hrs
    });
    console.log(`Token created with request UUID of ${request_uuid}`)
    res.json({"requestToken": token})
    res.send().status(200)
})

app.post('/request/zipFile',verifyToken, upload.single('zipFile'), function(req,res){
    var resultsList = []
    var cweList = []
    if(!req.valid){
        console.log(`File with request UUID ${req.uuid} is invalid.`)
        res.status(422).send("Wrong file type, only zip files are accepted.")
        return
    }
    console.log(`Zip file of request UUID ${req.uuid} received and stored.`)
    res.sendStatus(200)

    var pyProcess = spawn('python', ["./backend/createDB.py", req.uuid, req.queriesToUse, req.email])
    pyProcess.stdout.on('data', data => {
        console.log(data.toString())
    })
    pyProcess.stdout.on('end', function(){
        var csvList = fs.readdirSync(`./backend/scanResults/${req.uuid}_scanResults`);
        for(var i = 0; i < csvList.length; i++){
            let inputStream = fs.createReadStream(`./backend/scanResults/${req.uuid}_scanResults/${csvList[i]}`, 'utf8');
            inputStream
	            .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
	            .on('data', function (row) {
	                console.log('A row arrived: ', row);
	            })
	        .on('end', function () {
	            console.log('No more rows!');
	        });
        }
    })
})



app.post('/request/results', function(req,res) {
    
    res.json({
        one :{
            vulnerability: "SQL injection | model.js",
            description: "Untrusted input concatenated with raw SQL query can result in SQL injection",
            severity: "lorem",
            severityColor: "danger", //base on bootstrap button colors (primary,danger,warning,etc)
            owasp: "A1:lorem",
            cwe: "CWE-lorem:asdasd",
            filepath: "lorem.js",
            line: "[59:20]",
            codeCopied: `var upload = multer({storage: storages,
fileFilter: function(req, file, callback){
req.valid = file.mimetype == "application/x-zip-compressed"
return callback(null, file.mimetype == "application/x-zip-compressed")
}
});

var nodemailer = require('nodemailer');

app.post('/request/parameters', function(req,res){
var emailPattern = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
var email = req.body.email  
var queriesToUse = req.body.queriesToUse
if (!req.body.hasOwnProperty("email") || !req.body.hasOwnProperty("queriesToUse")) {
res.status(500).send("Internal Server Error")
return
}else if(!emailPattern.test(email) || !(queriesToUse.constructor === Array)){
res.status(422).send()
return`
        },
        two :{
            vulnerability: "lorem",
            description: "lorem",
            severity: "lorem",
            severityColor: "danger", //base on bootstrap button colors (primary,danger,warning,etc)
            owasp: "A1:lorem",
            cwe: "CWE-lorem:asdasd",
            filepath: "lorem.js",
            line: "[59:20]",
            codeCopied: `var upload = multer({storage: storages,
fileFilter: function(req, file, callback){
req.valid = file.mimetype == "application/x-zip-compressed"
return callback(null, file.mimetype == "application/x-zip-compressed")
}
});

var nodemailer = require('nodemailer');

app.post('/request/parameters', function(req,res){
var emailPattern = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
var email = req.body.email  
var queriesToUse = req.body.queriesToUse
if (!req.body.hasOwnProperty("email") || !req.body.hasOwnProperty("queriesToUse")) {
res.status(500).send("Internal Server Error")
return
}else if(!emailPattern.test(email) || !(queriesToUse.constructor === Array)){
res.status(422).send()
return`

        }
    })
    res.send()
})

module.exports=app;