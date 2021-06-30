var mysql = require('mysql');

var dbConnect = {
    getConnection:function(){
        var conn = mysql.createConnection({
            host:"localhost",
            user:"kodo",
            password:"kodoPass",
            database:"sp_travel"
        });
    return conn;
    }
}
module.exports = dbConnect;