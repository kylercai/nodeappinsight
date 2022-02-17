var fs = require('fs');
var filedata = "";

function add(a, b) {
    return a + b;
}

//var c=add(1, 2);
//console.log(c);

//console.info(new Date().toLocaleString('zh-CN', {hour12: false}));
//console.info(Math.floor(Math.random()*10));

filedata = fs.readFileSync('loganalytics.kusto', 'utf8');
console.info(filedata);