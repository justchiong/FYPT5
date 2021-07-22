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
    addResult(request_uuid, selected_option, cwe, type, description, severity, code_snippet, fileLocation, lineNumbers, referencedLocation, callback){
        console.log("Adding results...")
        var conn = db.getConnection()
        conn.connect(function(err){
            if(err){
                console.log(err)
                return callback(err, null)
            }
            else{
                var sql = 'INSERT INTO results (request_uuid, selected_option, cwe, type, description, severity, code_snippet, fileLocation, lineNumbers, referencedLocation) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
                conn.query(sql, [request_uuid, selected_option, cwe, type, description, severity, code_snippet, fileLocation, lineNumbers, referencedLocation], function(err,result){
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
                var sql = 'select requests.original_filename, results.fileLocation, results.selected_option, results.cwe, results.type, results.description, results.severity, results.code_snippet, results.lineNumbers, results.referencedLocation from results inner join requests on requests.uuid=results.request_uuid where results.request_uuid=?'
                conn.query(sql, [uuid], function(err, result){
                    if(err){
                        conn.end();
                        console.log(err)
                        return callback(err, null)
                    }else{
                        if(result.length == 0){
                            noResultSql = 'select requests.original_filename from requests where requests.uuid=?'
                            conn.query(noResultSql, [uuid], function(err, noRes){
                                if(err){
                                    conn.end();
                                    console.log(err)
                                    return callback(err, null)
                                }else{
                                    if(noRes.length == 0){
                                        noRes.push({}) 
                                        noRes[0].requestFound = false
                                    }else{
                                        noRes.push({})
                                        noRes[0].requestFound = true
                                    }
                                    noRes[0].resultsFound = false
                                    return callback(null, noRes)
                                }
                            })
                        }
                        else{
                            result[0].requestFound = true
                            result[0].resultsFound = true
                            return callback(null, result)
                        }


                    }
                })
            }
        })
    },
    alreadyExists(uuid, callback){
        console.log(`Checking if request with UUID of ${uuid} already exists...`)
        var conn = db.getConnection()
        conn.connect(function(err){
            if(err){
                console.log(err)
                return callback(err, null)
            }
            else{
                var sql = 'select requests.original_filename from requests where requests.uuid=?'
                conn.query(sql, [uuid], function(err,result){
                    conn.end()
                    if(err){
                        return callback(err, null)   
                    }else{
                        return callback(null, result)
                    }

                })
            }
        }) 
    }
}
module.exports=kodoDB;