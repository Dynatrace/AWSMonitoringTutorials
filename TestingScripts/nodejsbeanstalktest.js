var page = require('webpage').create(),
  system = require('system'),
  t, address;

// ======================================================================
// Usage
// ======================================================================
if (system.args.length === 1) {
  console.log('Usage: nodejsbeanstalktest.js <startURL> [<Username> <Echostring> <InvokeURL>]');
  phantom.exit();
}

// ======================================================================
// Helper Functions
// ======================================================================
function random (low, high) {
    var randomResult = Math.round(Number(Math.random() * (high - low))) + low;
	if(randomResult > high) randomResult = high;
	return randomResult;
}

function clickOnElementById(id) {
	page.evaluateJavaScript("function() { var ev=document.createEvent('MouseEvent');ev.initMouseEvent('click',true,true,window, null, 0, 0, 0, 0,false,false,false,false,0,null); document.getElementById('" + id + "').dispatchEvent(ev); }");
}

var minWaitFor = 0;
phantom.waitFor = function(callback, maxTime) {
  var startTime = Date.now();
  var timeLapsed = 0;
  do { 
    // Clear the event queue while waiting.
    // This can be accomplished using page.sendEvent()
    this.page.sendEvent('mousemove');
	timeLapsed = (Date.now() - startTime);
  } while ((timeLapsed < minWaitFor) || (!callback() && (timeLapsed < maxTime)));
}

// ======================================================================
// Prep Work - Setting up our variables
// ======================================================================
var randomUserNames = ["Andi","Joe","Gabi","Stephan","Joshua","John","Asad","Ted","Karolina","Jilene","Marci","Katie","Laurie","Lynne","Peter","Wayne","Joe","Ted","Susan"];
var randomEchStrings = ["Just Echo", "Another Echo", "Whats up?", "Hello??", "Somebody out there?"];
var randomInvokeURLs = ["https://www.amazon.com","http://www.cnn.com","http://www.foxnews.com","https://www.twitter.com","https://www.facebook.com","http://www.orf.at","http://www.dynatrace.com"];
t = Date.now();
address = system.args[1];
var username = (system.args.length > 2) ? system.args[2] : randomUserNames[random(0, randomUserNames.length)]; 
var echostring = (system.args.length > 3) ? system.args[3] : randomEchStrings[random(0, randomEchStrings.length)];
var invokeURL = (system.args.length > 4) ? system.args[4] : randomInvokeURLs[random(0, randomInvokeURLs.length)];
if(username == null || username == "undefined") username = "Default User";
if(echostring == null || echostring == "undefined") echostring = "Default Echo";
if(invokeURL == null || invokeURL == "undefined") invokeURL = "https://aws.amazon.com";
console.log("Start URL: " + address);
console.log("Username: " + username);
console.log("EchoString: " + echostring);
console.log("InvokeURL: " + invokeURL);
phantom.cookieEnabled = true;

// ======================================================================
// Step Finish: Waits until the step is done and then moves to the next or stops the script execution
// ======================================================================
function stepFinish(nextStep) {
  phantom.waitFor(function() {return !page.loading;}, 3000);
  var currResultText = page.evaluate(function(id) {return document.getElementById(id).innerText;}, "result");
  console.log("Current Result Text: " + currResultText);
  
  if(nextStep != null) nextStep(); else {
	console.log("DONE!!");
    phantom.exit();
  }
}

// ======================================================================
// Step 1: Load the initial page
// ======================================================================
function step1Open() {
  page.loading = true;
  page.onResourceRequested = function(request, networkRequest) {
    console.log('Request ' + JSON.stringify(request, undefined, 4));	
	console.log('Cookies' + JSON.stringify(page.cookies, undefined, 4));
  };
  page.onResourceReceived = function(response) {
    // console.log('Receive ' + JSON.stringify(response, undefined, 4));
  };
  page.open(address, function(status) {
      if (status !== 'success') {
        console.log('FAIL to load the address');
      } else {
        t = Date.now() - t;
        console.log('Loading ' + system.args[1]);
        console.log('Loading time ' + t + ' msec');
      }
	  page.loading = false;
	  
	  console.log('Cookies' + JSON.stringify(page.cookies, undefined, 4));

	  setTimeout(stepFinish, 5000, step2Login);
  });
}

// ======================================================================
// Step 2: Login
// ======================================================================
function step2Login() {
  console.log("CLICK ON LOGIN");
  page.evaluateJavaScript("function() { $('#Username').val('" + username + "'); }");
  clickOnElementById("Login");
  
  setTimeout(stepFinish, 5000, step3Echo);
}

// ======================================================================
// Step 3: Click on Echo
// ======================================================================
function step3Echo() {
  console.log("CLICK ON ECHO");
  page.evaluateJavaScript("function() { $('#SayText').val('" + echostring + "'); }");
  clickOnElementById("Echo");
  
  setTimeout(stepFinish, 5000, step4Invoke);
}

// ======================================================================
// Step 4: Click on Invoke
// ======================================================================
function step4Invoke() {
  console.log("CLICK ON INVOKE");
  page.evaluateJavaScript("function() { $('#RemoteURL').val('" + invokeURL + "'); }");
  clickOnElementById("Invoke");
  
  setTimeout(stepFinish, 5000, null);
}


// LAUNCH Script
step1Open();