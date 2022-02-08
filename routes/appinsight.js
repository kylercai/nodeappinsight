let appInsights = require('applicationinsights');
appInsights.setup("InstrumentationKey=0ad1757f-7ce0-c570-b74f-871aa5e8b1cc;EndpointSuffix=applicationinsights.azure.cn;IngestionEndpoint=https://chinaeast2-0.in.applicationinsights.azure.cn/");
appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = "appServer";
appInsights.start();
let client = appInsights.defaultClient;

var http = require('http');

var express = require('express');
var router = express.Router();

/* GET page. */
router.get('/', function(req, res, next) {
  res.render('appinsight', { 
	  title: 'Application Insights', 
	  timestamp: new Date().toLocaleString('zh-CN', {hour12: false}) 
	});

  client.trackEvent({
	  name: "demo event", 
	  properties: {
		  customProperty: "custom property value"
		}
	});

  client.trackException({exception: new Error("handled exceptions can be logged with this method")});
  client.trackMetric({name: "custom metric", value: 3});
  client.trackTrace({message: "trace message"});
  
  client.trackDependency({
	  target:"http://dbname", 
	  name:"select customers proc", 
	  data:"SELECT * FROM Customers", 
	  duration:231, 
	  resultCode:0, 
	  success: true, 
	  dependencyTypeName: "SQLDB"
	});

  client.trackRequest({
	  name:"GET /customers", 
	  url:"http://myserver/customers", 
	  duration:309, 
	  resultCode:200, 
	  success:true
	});

});

module.exports = router;

// http.createServer(function (request, response) {
//   response.writeHead(200, {'Content-Type':'text/plain'});
//   response.end('Hello World!');  

// 	client.trackEvent({name: "my custom event", properties: {customProperty: "custom property value"}});
// 	client.trackException({exception: new Error("handled exceptions can be logged with this method")});
// 	client.trackMetric({name: "custom metric", value: 3});
// 	client.trackTrace({message: "trace message"});
	
// 	client.trackDependency({
// 		target:"http://dbname", 
// 		name:"select customers proc", 
// 		data:"SELECT * FROM Customers", 
// 		duration:231, 
// 		resultCode:0, 
// 		success: true, 
// 		dependencyTypeName: "ZSQL"
// 	});

// 	client.trackRequest({name:"GET /customers", url:"http://myserver/customers", duration:309, resultCode:200, success:true});
  
// }).listen(3000);

//console.log('Server running at http://localhost:3000/');