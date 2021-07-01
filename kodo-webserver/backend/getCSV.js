const CsvReadableStream = require('csv-reader');
const fs = require('fs');
const delay = new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, 5000);
  })
  .then(() => {
    console.log('Done waiting.');
  });

async function readCSVs(locationArray){
    var out = []
    for(var file of locationArray){
        readCSV(file).then((result) => {
            console.log("HAIIIIIIIIIIIIII")
            console.log(result)
            out.push(result)
        });
    }
    return out
}
async function readCSV(fileLocation) {
    console.log(fileLocation)
    var inputStream = fs.createReadStream(fileLocation, 'utf8');
    var csvFileData = []
    inputStream
        .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
        .on('data', function (row){
            csvFileData.push(row)
        })
        .on('end', function () {
            console.log('No more rows!'); 
            return csvFileData
        });
}

const getCSV = (fileLocation) => {
    return new Promise(resolve => {
        var inputStream = fs.createReadStream(fileLocation, 'utf8');
        var csvFileData = []
        inputStream
            .pipe(new CsvReadableStream({ parseNumbers: true, parseBooleans: true, trim: true }))
            .on('data', function (row){
                csvFileData.push(row)
            })
            .on('end', function () {
                console.log('No more rows!'); 
                resolve(csvFileData)
            });
    })
}
getCSV(fileLocation).then(
    console.log()
)