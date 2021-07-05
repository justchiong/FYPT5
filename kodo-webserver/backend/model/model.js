var db = require('./databaseConfig.js');
var kodoDB = {
    addRequest(uuid, email, originalName, querieStr, callback){
        console.log("Adding Request...")
        var conn = db.getConnection()
        conn.connect(function(err){
            if(err){
                console.log(err)
                return callback(err, null)
            }
            else{
                var sql = 'INSERT INTO requests (uuid, email, original_filename, options_chosen) VALUES (?, ?, ?, ?)'
                conn.query(sql, [uuid, email, originalName, querieStr], function(err,result){
                    conn.end()
                    if(err){
                        return callback(err,null)

                    }else{
                        return callback(null, result)
                    }

                })
            }
        })
    },
    addResult(request_uuid, selected_option, cwe, type, description, severity, highlighted_code, referenced_code, code_snippet, fileLocation, lineNumbers, callback){
        var conn = db.getConnection()
        conn.connect(function(err){
            if(err){
                console.log(err)
                return callback(err, null)
            }
            else{
                var sql = 'INSERT INTO results (request_uuid, selected_option, cwe, type, description, severity, highlighted_code, referenced_code, code_snippet, fileLocation, lineNumbers) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                conn.query(sql, [request_uuid, selected_option, cwe, type, description, severity, highlighted_code, referenced_code, code_snippet, fileLocation, lineNumbers], function(err,result){
                    conn.end()
                    if(err){
                        return callback(err,null)

                    }else{
                        return callback(null, result)
                    }

                })
            }
        })
    }, 
    getResults(uuid, callback){
        console.log(`Getting results associated with request UUID of ${uuid}...`)
        var conn = db.getConnection()
        conn.connect(function(err){ 
            if(err){
                console.log(err)
                return callback(err, null)
            }else{
                var sql = 'select results.fileLocation, results.selected_option, results.cwe, results.type, results.description, results.severity, results.highlighted_code, results.referenced_code, results.code_snippet, results.lineNumbers from results where results.request_uuid=?'
                conn.query(sql, [uuid], function(err, result){
                    conn.end();
                    if(err){
                        console.log(err)
                        return callback(err, null)
                    }else{
                        return callback(null, result)
                    }
                })
            }
        })
    },
}
module.exports=kodoDB;