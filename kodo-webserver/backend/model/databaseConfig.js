var mysql=require('mysql');

var dbConnect={

    getConnection:function(){
        var conn=mysql.createConnection({
            host:"localhost",
            user:"root",
            password:"Aruther123",
            database:"sp_travel"

        }

        );

        return conn;

    }
}
module.exports=dbConnect;