var db = require('./databaseConfig.js');
var kodoDB = {
    searchTravel(maxCost, preferredMonth,preferredCountry, callback){
        var preferredMonthArray = preferredMonth.split("-")
        var preferredMonth = preferredMonthArray[1] + "-" + preferredMonthArray[0]
        var conn = db.getConnection()
        conn.connect(function(err){
                if(err){
                console.log(err)
                return callback(err, null)
            }else{
                if(maxCost == -1){
                    var sql = 'select * from travel_listings where country=? AND travelPeriod=?;'
                    console.log(`Getting travel listings with preferred month of ${preferredMonth} in the country of ${preferredCountry}`)
                }else{
                    var sql = 'select * from travel_listings where country=? AND travelPeriod=? AND price<=?;'
                    console.log(`Getting travel listings with preferred month of ${preferredMonth} in the country of ${preferredCountry} with the maximum cost of SGD\$${maxCost}`)
                }
                conn.query(sql, [preferredCountry, preferredMonth, maxCost], function(err, result){
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
	loginUser: function (username, password, callback) {
		var conn = db.getConnection();
		conn.connect(function (err) {
			if (err) {
				console.log(err);
				return callback(err, null);
			}
			else {
				console.log("Connected!");
				var sql = 'select userid, username, profile_pic_url, created_at, email, role from users where username=? and password=?';

				conn.query(sql, [username, password], function (err, result) {
					conn.end();
					if (err) {
						console.log("Err: " + err);
						return callback(err, null);
					} else {
                        return callback(null, result)
					}
				});
			}
		});
    },
    addRequest(callback){
        console.log("Adding Adding Request")
        var conn = db.getConnection()
        conn.connect(function(err){
            if(err){
                console.log(err)
                return callback(err, null)
            }
            else{
                var sql = "select userid, username, profile_pic_url, created_at, email, role from users"
                conn.query(sql, function(err,result){
                    conn.end()
                    if(err){
                        return callback(err,null)

                    }else{
                        return callback(null, result)
                    }

                })
            }
        })
    }
}
module.exports=kodoDB;