const async = require("async");
const https = require("https");
var docSubmissionIds = require("./docSubmissionIds.json");
var auth = require("./bearer_uq.json");
var uploadDoc = require("./uploadDoc.js")
var settings = require("./config/settings.json")

var options = {
    hostname: settings.uqDomain,
    path: settings.uqPath,
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Authorization':auth.value
    }
};

async.mapLimit(docSubmissionIds,10,function(docSubId,callback){
	var body = JSON.stringify({
	    verbose: true,
	    data: {
	    submissionIdDocuments:docSubId
	  }
	});
	var data = '';
	// Sending the request
	var request = https.request(options, (response) => {
	    response.on('data', (chunk) => {
	        data += chunk;
	    });
	    // Ending the response
	    response.on('end', () => {
	        //console.log('Body:', data);
	        //console.log('docSubId',docSubId)
	        var responseData = JSON.parse(data);
	        //console.log(responseData.data.resolved.quote_pricingModelDocuments1);
	        let quote_pricingModelDocuments1 = responseData.data.resolved.quote_pricingModelDocuments1;
	        console.log('Sub: ',quote_pricingModelDocuments1);
	        let contractDocuments = responseData.data.resolved.contract_contractDocuments;
	        //console.log('Contract: ',contractDocuments);
	        async.eachSeries(quote_pricingModelDocuments1,function(doc,clb){
	        	    console.log('docSubId',docSubId)
	        		console.log(doc);
		        	uploadDoc.upload("638d8b79508e9122fd9b294d",doc,function(err,data){
			        	if(err)
			        		console.log(err);
			        	clb;
	        		});
	        },
	        function(err){
	        	callback;
	        });
	    });
	}).on("error", (err) => {
	    console.log("Error: ", err);
	    callback;
	});
	request.write(body);
	request.end();
});


