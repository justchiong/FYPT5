var app=require('./controller/app.js');
var port=3000;

var server=app.listen(port,function(){
    
    console.log("backEnd hosted at localhost:"+port);

    
});