var mysql = require('mysql');

var dbConnect = {
    getConnection:function(){
        var conn = mysql.createConnection({
            host:"localhost",
            user:"root",
            password:"Djboy900123!",
            database:"kododb",
            port: 3306
        });
    return conn;
    }   
}

module.exports = dbConnect;