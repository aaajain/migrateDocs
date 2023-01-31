const https = require("https");
var auth = require("./bearer_sm.json");
var settings = require("./config/settings.json")

var options = {
    hostname: settings.smDomain,
    path: settings.smPath,
    method: 'PUT',
    headers: {
        'Content-Type': 'application/json',
        'Authorization':auth.value
    }
};

module.exports.upload = function(submissionIdDocuments,quote_pricingModelDocuments1,callback){
	var body = JSON.stringify({
	    verbose: true,
	    data: {
	    quote_pricingModelDocuments1:quote_pricingModelDocuments1,
	    submissionIdDocuments:submissionIdDocuments,
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
	        console.log('updated');
	        callback;
	    });

	}).on("error", (err) => {
	    console.log("Error: ", err);
	    callback;
	});

	request.write(body);
	request.end();
};

