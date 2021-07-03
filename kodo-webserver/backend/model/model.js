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
    addResult(uuid, selected_options, cwe, type, description, severity, highlighted_code, referenced_code, code_snippet, callback){
        console.log("Adding Result...")
        console.log(`uuid: ${uuid}`)
        console.log(`selected_options: ${selected_options}`)
        console.log(`cwe: ${cwe}`)
        console.log(`type: ${type}`)
        console.log(`description: ${description}`)
        console.log(`severity: ${severity}`)
        console.log(`highlighted_code: ${highlighted_code}`)
        console.log(`referenced_code: ${referenced_code}`)
        console.log(`code_snippet: ${code_snippet}`)
        // var conn = db.getConnection()
        // conn.connect(function(err){
        //     if(err){
        //         console.log(err)
        //         return callback(err, null)
        //     }
        //     else{
        //         var sql = 'INSERT INTO result (uuid, selected_options, cwe, type, description, severity, highlighted_code, referenced_code, code_snippet) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
        //         conn.query(sql, [uuid, email, originalName, querieStr], function(err,result){
        //             conn.end()
        //             if(err){
        //                 return callback(err,null)

        //             }else{
        //                 return callback(null, result)
        //             }

        //         })
        //     }
        // })
    }
}
module.exports=kodoDB;