var jwt = require('jsonwebtoken');

var config = require('./config.js');

function verifyToken(req, res, next){

    var token = req.headers['authorization']; //retrieve authorization header's content
    if(!token || !token.startsWith('Bearer ') || token===null || token===undefined){ //process the token
        return res.status(403).send({'auth':false, 'message':'Not logged in!'});
    }
    else{
        token=token.split('Bearer ')[1]; //obtain the token's value
       jwt.verify(token, config.key, function(err, decoded){ //verify token
        if(err){
            return res.status(403).send({'auth':false, 'message':'Invalid Request Token!'});
        }else{
            req.email = decoded.userEmail //decode the email and store in req for use
            req.queriesToUse = decoded.queries//decode the queries to use and store in req for use
            req.uuid = decoded.request_uuid
            next();
        }
       });
    }
}

module.exports = verifyToken;