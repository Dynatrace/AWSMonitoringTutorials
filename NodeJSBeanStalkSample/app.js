var port = process.env.PORT || 3000,
    http = require('http'),
    fs = require('fs'),
	os = require('os'),
    html = fs.readFileSync('index.html').toString().replace("HOSTNAME", os.hostname());

var log = function(entry) {
	// console.log(entry);
    fs.appendFileSync('/tmp/sample-app.log', new Date().toISOString() + ' - ' + entry + '\n');
};

function sleep(time) {
    var stop = new Date().getTime();
    while(new Date().getTime() < stop + time) {
        ;
    }
}

var server = http.createServer(function (req, res) {
    if (req.method === 'POST') {
        var body = '';

        req.on('data', function(chunk) {
            body += chunk;
        });

        req.on('end', function() {
            if (req.url === '/') {
                log('Received message: ' + body);
            } else if (req.url = '/scheduled') {
                log('Received task ' + req.headers['x-aws-sqsd-taskname'] + ' scheduled at ' + req.headers['x-aws-sqsd-scheduled-at']);
            }

            res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});
            res.end();
        });
    } else if (req.url.startsWith("/api")) {
		var url = require('url').parse(req.url, true);
		var closeResponse = true;

        // sleep a bit :-)
		var sleeptime = parseInt(url.query["sleep"]);
		if(sleeptime === 0) sleeptime = 500;
		log("Sleeptime: " + sleeptime);
		sleep(sleeptime);

		// figure out which API call they want to execute
        var status = "Unkown API Call";
		if(url.pathname === "/api/echo") {
			// Usage: /api/echo?text=your text to be echoed!
			status = "Thanks for saying: " + url.query["text"];
		}
		if(url.pathname === "/api/invoke") {
			// Usage: /api/invoke?url=http://www.yourdomain.com 
			var urlRequest = url.query["url"];
			status = "Trying to invoke remote call to: " + urlRequest;
			
			var http = null;
			if(urlRequest.startsWith("https")) http = require("https");
			else http = require("http");
			closeResponse = false;
			var options = {
              host: urlRequest,
              path: '/'
            };
			var result = http.get(urlRequest, function(getResponse) {
				log('STATUS: ' + getResponse.statusCode);
				log('HEADERS: ' + JSON.stringify(getResponse.headers));

				// Buffer the body entirely for processing as a whole.
				var bodyChunks = [];
				getResponse.on('data', function(chunk) {
				  bodyChunks.push(chunk);
				}).on('end', function() {
				  var body = Buffer.concat(bodyChunks);
				  log('BODY: ' + body);
				  status = "Request to '" + url.query["url"] + "' returned with HTTP Status: " + getResponse.statusCode + " and response body length: " + body.length;
				  res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});	
				  res.write(status);
				  res.end();
				}).on('error', function(error) {
				  status = "Request to '" + url.query["url"] + "' returned in an error: " + error;
				  res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});	
				  res.write(status);
				  res.end();					
				})
			});
		}
		if(url.pathname === "/api/version") {
			// usage: /api/version
			// simply returns the version number as defined in the MYVERSION env-variable which is specified in the beanstalk version.conf file
			status = "Running on version: " + process.env.MYVERSION;
		}

		// only close response handler if we are done with work!
		if(closeResponse) {
		   res.writeHead(200, 'OK', {'Content-Type': 'text/plain'});	
		   res.write(status);
		   res.end();
		}
	}
	else
	{
		res.writeHead(200, 'OK', {'Content-Type': 'text/html'});
        res.write(html);
        res.end();
    }
});

// Listen on port 3000, IP defaults to 127.0.0.1
server.listen(port);

// Put a friendly message on the terminal
console.log('Server running at http://127.0.0.1:' + port + '/');
