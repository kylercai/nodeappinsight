let appInsights = require('applicationinsights');
appInsights.setup("<Application Insight Connection String>");
appInsights.defaultClient.context.tags[appInsights.defaultClient.context.keys.cloudRole] = "appServer";
appInsights.start();
let client = appInsights.defaultClient;



var http = require('http');
var fs = require('fs');

var express = require('express');
const { Warning, Information } = require('applicationinsights/out/Declarations/Contracts/Generated/SeverityLevel');
var router = express.Router();
var metricValue = 0;
var reg = new RegExp("\n", "g");
var filedata = fs.readFileSync('./routes/loganalytics.kusto', 'utf8').replace(reg, "<br/>");

/* GET page. */
router.get('/', function(req, res, next) {
  metricValue	= Math.floor(Math.random()*10);

  res.render('appinsight', { 
	  title: 'Azure AppInsights w LogAnalytics', 
	  metric: metricValue,
	  filedata: filedata,
	  time: new Date().toLocaleString('zh-CN', {hour12: false}) 
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
		module: "KCModule001",
		exceptioninfo: "your exception detail",
		exceptionmetrics: metricValue
	  }
  	});
	client.trackException({
		exception: new Error("KC customized Warning-exception detail"),
		severityLevel: Warning,
		properties: {
			module: "KCModule001",
			exceptioninfo: "your warning detail",
			exceptionmetrics: metricValue
		  }
	});
  
	
  client.trackMetric({
	  name: "KCMetric001", 
	  value: metricValue
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
