let appInsights = require('applicationinsights');
appInsights.setup("InstrumentationKey=0ad1757f-7ce0-c570-b74f-871aa5e8b1cc;EndpointSuffix=applicationinsights.azure.cn;IngestionEndpoint=https://chinaeast2-0.in.applicationinsights.azure.cn/");
appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = "appServer";
appInsights.start();
let client = appInsights.defaultClient;

var http = require('http');

var express = require('express');
const { Warning, Information } = require('applicationinsights/out/Declarations/Contracts/Generated/SeverityLevel');
var router = express.Router();
var hitCount = 0;

/* GET page. */
router.get('/', function(req, res, next) {
  res.render('appinsight', { 
	  title: 'Azure AppInsights w LogAnalytics', 
	  timestamp: new Date().toLocaleString('zh-CN', {hour12: false}) 
	});

  client.trackEvent({
	  name: "KCEvent001", 
	  properties: {
		  module: "KCModule001"
		}
	});

  client.trackException({
	  exception: new Error("KC customized Error-exception detail"),
	  properties: {
		module: "KCModule001"
	  }
  	});
	client.trackException({
		exception: new Error("KC customized Warning-exception detail"),
		severityLevel: Warning,
		properties: {
			module: "KCModule001"
		  }
	});
  

  client.trackMetric({
	  name: "KCMetric001", 
	  value: Math.floor(Math.random()*10)
	});
  
	client.trackTrace({
		message: "KC tracing message for detail!!!", 
		properties: {
			module: "KCModule001"
		  }
	});
  
  client.trackDependency({
	  target:"http://dbname", 
	  name:"select customers proc", 
	  data:"SELECT * FROM Customers", 
	  duration:231, 
	  resultCode:0, 
	  success: true, 
	  dependencyTypeName: "SQLDB",
	  properties: {
		module: "KCModule001"
	  }
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