mystring = 'This query depends on [["a user-provided value"|"relative:///dvna-master/core/appHandler.js:10:58:10:65"]].'
var matches = mystring.match(/\[\[(.*?)\]/);
if(matches){
    substring = matches[0].split('\|')[1]
    submatches = substring.match(/\"(.*?)\"/);
    if(submatches){
        console.log(submatches[1].replace("relative://", ))
    }
}
