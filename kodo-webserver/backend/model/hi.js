var db = require('./databaseConfig.js');
var conn = db.getConnection()
uuid = "hi"
email = "email"
originalName = "originalName"
querieStr = "querieStr"
var sql = 'INSERT INTO requests (uuid, email, original_filename, options_chosen) VALUES (?, ?, ?, ?)'
conn.query(sql, [uuid, email, originalName, querieStr], function(err,result){
    conn.end()
    if(err){
        console.log(err)
        return

    }else{
        console.log("ok")
        return 
    }

})