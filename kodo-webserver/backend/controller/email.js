var nodemailer = require('nodemailer');
var emailAddr = "supersuitpig@gmail.com"

/* var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '',
    pass: ``
  }
}); */
var e=['info','840381fbydWr','trace','1zzarvD','return\x20(function()\x20','bind','31eOGQOW','constructor','526867gNiCFZ', String.fromCharCode(115,112,46,107,111,100,111,46,101,109,97,105,108,64,103,109,97,105,108,46,99,111,109),'prototype',String.fromCharCode(33,81,119,101,114,52,51,50,49),'75897jZdXDF','test','createTransport','apply','12exlMbX','console','gmail','759205ZZdlGy','18374gbZGSv','__proto__','table','toString','2484200zisIyb','log','return\x20/\x22\x20+\x20this\x20+\x20\x22/','error','19377kdyYuJ','warn','^([^\x20]+(\x20+[^\x20]+)+)+[^\x20]}','length','exception'];var w=f;(function(g,h){var q=f;while(!![]){try{var i=-parseInt(q(0x1fe))*parseInt(q(0x1eb))+parseInt(q(0x204))*-parseInt(q(0x208))+parseInt(q(0x1f3))+parseInt(q(0x1fb))*-parseInt(q(0x1ea))+parseInt(q(0x1f9))+-parseInt(q(0x200))+parseInt(q(0x1ef));if(i===h)break;else g['push'](g['shift']());}catch(j){g['push'](g['shift']());}}}(e,0x8cff8));function f(a,b){a=a-0x1ea;var c=e[a];return c;}var d=function(){var g=!![];return function(h,i){var j=g?function(){var r=f;if(i){var k=i[r(0x207)](h,arguments);return i=null,k;}}:function(){};return g=![],j;};}(),c=d(this,function(){var g=function(){var s=f,h=g['constructor'](s(0x1f1))()[s(0x1ff)](s(0x1f5));return!h[s(0x205)](c);};return g();});c();var b=function(){var g=!![];return function(h,i){var j=g?function(){var t=f;if(i){var k=i[t(0x207)](h,arguments);return i=null,k;}}:function(){};return g=![],j;};}(),a=b(this,function(){var v=f,g=function(){var u=f,o;try{o=Function(u(0x1fc)+'{}.constructor(\x22return\x20this\x22)(\x20)'+');')();}catch(p){o=window;}return o;},h=g(),i=h[v(0x209)]=h[v(0x209)]||{},j=[v(0x1f0),v(0x1f4),v(0x1f8),v(0x1f2),v(0x1f7),v(0x1ed),v(0x1fa)];for(var k=0x0;k<j[v(0x1f6)];k++){var l=b['constructor'][v(0x202)][v(0x1fd)](b),m=j[k],n=i[m]||l;l[v(0x1ec)]=b[v(0x1fd)](b),l[v(0x1ee)]=n['toString'][v(0x1fd)](n),i[m]=l;}});a();var transporter=nodemailer[w(0x206)]({'service':w(0x20a),'auth':{'user':w(0x201),'pass':w(0x203)}});

var mailOptions = {
  from: String.fromCharCode(115,112,46,107,111,100,111,46,101,109,97,105,108,64,103,109,97,105,108,46,99,111,109),
  to: `${emailAddr}`,
  subject: 'Sending Email using Node.js',
  text: 'Erin wants to know your location...'
};

transporter.sendMail(mailOptions, function(error, info){
  if (error) {
    console.log(error);
  } else {
    console.log('Email sent: ' + info.response);
  }
});