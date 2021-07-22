var express = require('express');
var app = express();
var kodoDB = require('../model/model.js');

var bodyParser = require('body-parser');
const cors = require("cors");
app.use(bodyParser.json())
app.use(cors());
const spawn = require('child_process').spawn;
const readline = require('readline');

const JWT_SECRET = require("../auth/config.js");
const jwt = require('jsonwebtoken')
const {
    v4: uuidv4
} = require('uuid');
const verifyToken = require('../auth/verifyToken.js');
var multer = require('multer');

const fastcsv = require('fast-csv');
const fs = require('fs');

<<<<<<< HEAD
var multer = require('multer');
const { alreadyExists } = require('../model/model.js');
=======
>>>>>>> parent of 65a8b42b (Updated URLs to exclude file extension, fixed bug for scans with no results.)
var storages = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, './backend/zipFiles/');
    },
    filename: function (req, file, callback) {
        callback(null, req.uuid + ".zip");
    }
});

    var upload = multer({
        storage: storages,
        fileFilter: function (req, file, callback) {
            req.valid = file.mimetype == "application/x-zip-compressed"
            req.originalName = file.originalname
            return callback(null, file.mimetype == "application/x-zip-compressed")
        }
    });

    function removeReqFiles(requuid) {
        fs.rmdir(`.\\backend\\webServer_Folders\\${requuid}`, {
            recursive: true
        }, (err) => {
            if (err) {
                throw err;
            }
        })
        fs.rmdir(`.\\backend\\scanResults\\${requuid}_scanResults`, {
            recursive: true
        }, (err) => {
            if (err) {
                throw err;
            }
        })
        fs.rmdir(`.\\backend\\databases\\${requuid}_db`, {
            recursive: true
        }, (err) => {
            if (err) {
                throw err;
            }
        })
        fs.unlink(`.\\backend\\zipFiles\\${requuid}.zip`, (err) => {
            if (err) {
                throw err
            }
        })
    }

    function extractFileName(mystring){
        csvColumn = ""
        csvColumn = mystring
        let matches = csvColumn.match(/\[\[(.*?)\]/);
        if(matches){
            let substring = matches[0].split('\|')[1]
            let submatches = substring.match(/\"(.*?)\"/);
            if(submatches){
                return submatches[1].replace("relative://", "").split(":")[0]
            }
        }
    }

    function isUuid(uuid){
        let uuidRegExp = new RegExp("^[0-9A-Fa-f]{8}-[0-9A-Fa-f]{4}-[4][0-9A-Fa-f]{3}-[89ABab][0-9A-Fa-f]{3}-[0-9A-Fa-f]{12}$")
        return uuidRegExp.test(uuid)
    }

    function sevColor(severity){
        severity = severity.toLowerCase()
        //get severityColor for html
        if (severity=="error"){
            return 'danger'
        }else if (severity=="warning"){
            return 'warning'
        }else if (severity=="recommendation"){
            return 'primary'
        }
    }

    app.post('/request/parameters', function (req, res) {
        var emailPattern = new RegExp("[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")
        var email = req.body.email
        var queriesToUse = req.body.queriesToUse
        if (!req.body.hasOwnProperty("email") || !req.body.hasOwnProperty("queriesToUse")) {
            res.status(500).send("Internal Server Error")
            return
        } else if (!emailPattern.test(email) || !(queriesToUse.constructor === Array)) {
            res.status(422).send()
            return
        } else {
            request_uuid = uuidv4()
            var token = jwt.sign({
                requestId: request_uuid,
                userEmail: email,
                queries: queriesToUse
            }, JWT_SECRET.key, {
                expiresIn: 86400 //expires in 24 hrs
            });
            console.log(`Token created with request UUID of ${request_uuid}`)
            res.json({
                "requestToken": token
            })
            res.send().status(200)
        }
    })

    app.post('/request/zipFile', verifyToken, upload.single('zipFile'), function (req, res) {
        if (!req.valid) {
            console.log(`File with request UUID ${req.uuid} is invalid.`)
            res.status(422).send("Wrong file type, only zip files are accepted.")
            return
        }
<<<<<<< HEAD
        kodoDB.alreadyExists(req.uuid, function (err, result){
            if(err){
                console.log(err)
                res.sendStatus(500)
                return
            }
            if(result){
                if(result.length == 1){
                    console.log("UUID already exists!")
                    res.status(409).send("UUID Already Exists")
                    return
                }else{
                    console.log("UUID does not already exist\n") 
                    console.log(`Zip file of request UUID ${req.uuid} received and stored.`)

                    var pyProcess = spawn('python', ["./backend/createDB.py", req.uuid, req.queriesToUse, req.email])
                    pyProcess.stdout.on('data', data => {
                        console.log(data.toString())
                    })

                    pyProcess.stdout.on('end', function () {
                        console.log("Completed Scanning and Creation of Results")
                        console.log("Starting Extraction of CSV Data...")
                        var csvList = fs.readdirSync(`./backend/scanResults/${req.uuid}_scanResults`);
                        var locationArray = []
                        csvList.forEach(element => locationArray.push(`./backend/scanResults/${req.uuid}_scanResults/` + element));
                        var querieStr = req.queriesToUse.toString()
                        kodoDB.addRequest(req.uuid, req.email, req.originalName, querieStr, function (err, result) {
                            if (err) {
                                console.log(err)
                            } else {
                                for (let i = 0; i < csvList.length; i++) {
                                    
                                    let csvData = [];
                                    fastcsv
                                        .parseFile(`./backend/scanResults/${req.uuid}_scanResults/${csvList[i]}`)
                                        .on('data', (data) => {
                                            csvData.push(data);
                                        })
                                        .on('end', () => {
                                            if (csvData.length == 0) {
                                                console.log(csvData)
                                                removeReqFiles(req.uuid)
                                                console.log('Completed Deleting of Request Files.')
                                                console.log("Request uuid: " + req.uuid)
                                                res.status(200).send({acceptedID:`${req.uuid}`})
                                                return
                                            } else {
                                                let highlightedLineStartArray = []
                                                let highlightedCharStartArray = []

                                                let highlightedLineEndArray = []
                                                let highlightedCharEndArray = []


                                                let referencedLineStartArray = []
                                                let referencedCharStartArray = []

                                                let referencedLineEndArray = []
                                                let referencedCharEndArray = []


                                                let startlineArray = []
                                                let lineCountArray = []
                                                let snippetArray = []
                                                let endLineCountArray = []

                                                let endofCodeSnippetArray = []

                                                for (let j = 0; j < csvData.length; j++) {
                                                    let row = csvData[j]
                                                    let startLineNumber = 0
                                                    let shortenedString = ""

                                                    shortenedString = row[3].substring(row[3].indexOf("relative:") + 9)
                                                    highlightedCodeLocation = shortenedString.substring(shortenedString.indexOf(":") + 1, shortenedString.indexOf("\""))
                                                    highlightedArray = highlightedCodeLocation.split(":")




                                                    if(extractFileName(row[3]) != row[4]){
                                                        highlightedLineStartArray.push(parseInt(row[5]))
                                                        highlightedCharStartArray.push(parseInt(row[6]))    
                                                        highlightedLineEndArray.push(parseInt(row[7]))
                                                        highlightedCharEndArray.push(parseInt(row[8]))
=======

        console.log(`Zip file of request UUID ${req.uuid} received and stored.`)

        var pyProcess = spawn('python', ["./backend/createDB.py", req.uuid, req.queriesToUse, req.email])
        pyProcess.stdout.on('data', data => {
            console.log(data.toString())
        })

        pyProcess.stdout.on('end', function () {
            console.log("Completed Scanning and Creation of Results")
            console.log("Starting Extraction of CSV Data...")
            var csvList = fs.readdirSync(`./backend/scanResults/${req.uuid}_scanResults`);
            var locationArray = []
            csvList.forEach(element => locationArray.push(`./backend/scanResults/${req.uuid}_scanResults/` + element));
            var querieStr = req.queriesToUse.toString()
            kodoDB.addRequest(req.uuid, req.email, req.originalName, querieStr, function (err, result) {
                if (err) {
                    console.log(err)
                } else {
                    for (let i = 0; i < csvList.length; i++) {
                        
                        let csvData = [];
                        fastcsv
                            .parseFile(`./backend/scanResults/${req.uuid}_scanResults/${csvList[i]}`)
                            .on('data', (data) => {
                                csvData.push(data);
                            })
                            .on('end', () => {
                                if (csvData == []) {
                                    return
                                } else {
                                    let highlightedLineStartArray = []
                                    let highlightedCharStartArray = []

                                    let highlightedLineEndArray = []
                                    let highlightedCharEndArray = []


                                    let referencedLineStartArray = []
                                    let referencedCharStartArray = []

                                    let referencedLineEndArray = []
                                    let referencedCharEndArray = []


                                    let startlineArray = []
                                    let lineCountArray = []
                                    let snippetArray = []
                                    let endLineCountArray = []

                                    let endofCodeSnippetArray = []

                                    for (let j = 0; j < csvData.length; j++) {
                                        let row = csvData[j]
                                        let startLineNumber = 0
                                        let shortenedString = ""

                                        shortenedString = row[3].substring(row[3].indexOf("relative:") + 9)
                                        highlightedCodeLocation = shortenedString.substring(shortenedString.indexOf(":") + 1, shortenedString.indexOf("\""))
                                        highlightedArray = highlightedCodeLocation.split(":")




                                        if(extractFileName(row[3]) != row[4]){
                                            highlightedLineStartArray.push(parseInt(row[5]))
                                            highlightedCharStartArray.push(parseInt(row[6]))    
                                            highlightedLineEndArray.push(parseInt(row[7]))
                                            highlightedCharEndArray.push(parseInt(row[8]))
                                        }
                                        else{
                                            highlightedLineStartArray.push(parseInt(highlightedArray[0]))
                                            highlightedCharStartArray.push(parseInt(highlightedArray[1]))
                                            highlightedLineEndArray.push(parseInt(highlightedArray[2]))
                                            highlightedCharEndArray.push(parseInt(highlightedArray[3]))
                                        }
                                        referencedLineStartArray.push(parseInt(row[5]))
                                        referencedCharStartArray.push(parseInt(row[6]))
                                        referencedLineEndArray.push(parseInt(row[7]))
                                        referencedCharEndArray.push(parseInt(row[8]))

                                        endofCodeSnippetArray.push(0)

                                        startLineNumber = highlightedLineStartArray[j]
                                        if (startLineNumber > 5) {
                                            startLineNumber -= 5
                                        } else {
                                            startLineNumber = 1
                                        }
                                        startlineArray.push(startLineNumber)
                                        snippetArray.push("")
                                        lineCountArray.push(0)
                                        endLineCountArray.push(0)

                                        fileReadStream = fs.createReadStream(`./backend/webServer_Folders/${req.uuid}${row[4]}`)
                                        readline.createInterface({
                                                input: fileReadStream,
                                                output: process.stdout,
                                                terminal: false
                                            })
                                            .on('line', (line) => {
                                                lineCountArray[j]++
                                                if (lineCountArray[j] >= startlineArray[j]) {
                                                    if (lineCountArray[j] <= referencedLineEndArray[j]) {
                                                        snippetArray[j] += `${line}\n`
                                                        endofCodeSnippetArray[j] = lineCountArray[j]

                                                    } else if (endLineCountArray[j] < 5) {
                                                        snippetArray[j] += `${line}\n`
                                                        endofCodeSnippetArray[j] = lineCountArray[j]
                                                        endLineCountArray[j]++
>>>>>>> parent of 65a8b42b (Updated URLs to exclude file extension, fixed bug for scans with no results.)
                                                    }
                                                    else{
                                                        highlightedLineStartArray.push(parseInt(highlightedArray[0]))
                                                        highlightedCharStartArray.push(parseInt(highlightedArray[1]))
                                                        highlightedLineEndArray.push(parseInt(highlightedArray[2]))
                                                        highlightedCharEndArray.push(parseInt(highlightedArray[3]))
                                                    }
<<<<<<< HEAD
                                                    referencedLineStartArray.push(parseInt(row[5]))
                                                    referencedCharStartArray.push(parseInt(row[6]))
                                                    referencedLineEndArray.push(parseInt(row[7]))
                                                    referencedCharEndArray.push(parseInt(row[8]))

                                                    endofCodeSnippetArray.push(0)

                                                    startLineNumber = highlightedLineStartArray[j]
                                                    if (startLineNumber > 5) {
                                                        startLineNumber -= 5
                                                    } else {
                                                        startLineNumber = 1
=======
                                                    if (i == csvList.length - 1 && j == csvData.length - 1) {
                                                        removeReqFiles(req.uuid)
                                                        console.log('Completed Deleting of Request Files.')
                                                        console.log("Request uuid: " + req.uuid)
                                                        res.status(200).send({acceptedID:`${req.uuid}`})
>>>>>>> parent of 65a8b42b (Updated URLs to exclude file extension, fixed bug for scans with no results.)
                                                    }
                                                    startlineArray.push(startLineNumber)
                                                    snippetArray.push("")
                                                    lineCountArray.push(0)
                                                    endLineCountArray.push(0)

                                                    fileReadStream = fs.createReadStream(`./backend/webServer_Folders/${req.uuid}${row[4]}`)
                                                    readline.createInterface({
                                                            input: fileReadStream,
                                                            output: process.stdout,
                                                            terminal: false
                                                        })
                                                        .on('line', (line) => {
                                                            lineCountArray[j]++
                                                            if (lineCountArray[j] >= startlineArray[j]) {
                                                                if (lineCountArray[j] <= referencedLineEndArray[j]) {
                                                                    snippetArray[j] += `${line}\n`
                                                                    endofCodeSnippetArray[j] = lineCountArray[j]

                                                                } else if (endLineCountArray[j] < 5) {
                                                                    snippetArray[j] += `${line}\n`
                                                                    endofCodeSnippetArray[j] = lineCountArray[j]
                                                                    endLineCountArray[j]++
                                                                }

                                                            }
                                                        })
                                                        .on('close', () => {
                                                            let lineNumbers = `${startlineArray[j]}:${endofCodeSnippetArray[j]}`
                                                            let referencedLocation = `${referencedLineStartArray[j]}:${referencedCharStartArray[j]}:${referencedLineStartArray[j]}:${referencedCharEndArray[j]}`
                                                            let selectedOption = csvList[i].split("-separator-")[0]
                                                            let cwe = csvList[i].split("-separator-")[1].replace(".csv", "")
                                                            let description = csvData[j][1]
                                                            let descriptionArray = csvData[j][3].split("[[")
                                                            let decriptionArray2 = descriptionArray[1].split("]]")
                                                            let highlightedStr = decriptionArray2[0].substring(1, decriptionArray2[0].substring(1).indexOf("\"") + 1)
                                                            description += `\n${descriptionArray[0]}\|${highlightedStr}\|${decriptionArray2[1]}`
                                                            kodoDB.addResult(req.uuid, selectedOption, cwe, csvData[j][0], description, csvData[j][2], snippetArray[j], csvData[j][4], lineNumbers, referencedLocation, function (err, result) {
                                                                if (err) {
                                                                    console.log(err)
                                                                }

                                                                if ( (i == csvList.length - 1 && j == csvData.length - 1)) {
                                                                    removeReqFiles(req.uuid)
                                                                    console.log('Completed Deleting of Request Files.')
                                                                    console.log("Request uuid: " + req.uuid)
                                                                    res.status(200).send({acceptedID:`${req.uuid}`})
                                                                }
                                                            })
                                                        });
                                                }
                                            }
                                        })
                                }
                            }
                        })
                    })
                }
            }
        })
    })



    app.get('/request/results/:uuid', function (req, res) {
        uuid = req.params.uuid
        //validate uuid pattern match
        if (!isUuid(uuid)) {
            res.sendStatus(400)
        } else {
            kodoDB.getResults(uuid, function (err, result) {
                if (err) {
                    res.sendStatus(500)
                } else {
                    let resultsArray = []
                    let errorArray = []
                    let warnArray = []
                    let recommArray = []
                    let allGeneral = {}

                    if (result[0].resultsFound == true && result[0].requestFound == true) {
                        for(var k = 0; k < result.length; k++){
                            startLine = result[k].lineNumbers.substring(0, result[k].lineNumbers.indexOf(":"))
                            if (startLine<1){startLine=1}
                            result[k].selected_option = result[k].selected_option.split("_").join(" ")

                            if(result[k].severity == "error"){
                                errorArray.push(result[k])
                            }else if(result[k].severity == "warning"){
                                warnArray.push(result[k])
                            }else if(result[k].severity == "reccomendations"){
                                recommArray.push(result[k])
                            }
                            singleResult = {
                                vulnerability: `${result[k].selected_option} | ${result[k].fileLocation}`,
                                description: `${result[k].type}. ${result[k].description}`,
                                severity: result[k].severity.toUpperCase(),
                                severityColor: sevColor(result[k].severity), //base on bootstrap button colors (primary,danger,warning,etc)
                                owasp: result[k].selected_option,
                                cwe: result[k].cwe,
                                filepath: result[k].fileLocation,
                                line: `${result[k].lineNumbers}`,
                                lineStart: startLine,
                                codeCopied: result[k].code_snippet,
                                selected_option: result[k].selected_option,
                                referencedLocation: `${result[k].referencedLocation}`
                            }
                            resultsArray.push(singleResult)
                        }
                    }
                        allGeneral = {
                            'totalErrors': errorArray.length,
                            'totalWarns': warnArray.length,
                            'totalRecomms': recommArray.length,
                            'totalIssues': resultsArray.length,
                            'resultsfound': result[0].resultsFound,
                            'requestfound': result[0].requestFound
                        }
                        if(result[0].requestFound == true){
                            allGeneral.fileName = result[0].original_filename
                        }
                        console.log(`Array of results retrieved: \n${resultsArray}`)
                        console.log(`General Information of Scan: \n${allGeneral}`)
                        res.send({
                            'results': resultsArray,
                            'allGeneral': allGeneral
                        })
                }
            })
        }
    })

module.exports = app;