var page = require('webpage').create(),
  system = require('system'),
  t, address;

if (system.args.length === 1) {
  console.log('Usage: nodejsbeanstalktest.js <startURL> [<Username> <Echostring> <InvokeURL>]');
  phantom.exit();
}

function random (low, high) {
    return Math.round(Number(Math.random() * (high - low)) + low);
}

phantom.waitFor = function(callback) {
  do {
    // Clear the event queue while waiting.
    // This can be accomplished using page.sendEvent()
    this.page.sendEvent('mousemove');
  } while (!callback());
}

console.log(random(0, 10));

// ======================================================================
// Prep Work - Setting up our variables
// ======================================================================
var randomUserNames = ["Andi","Joe","Gabi","Stephan","Joshua","John","Asad","Ted","Karolina","Jilene","Marci","Katie","Laurie","Lynne","Peter","Wayne","Joe","Ted","Susan"];
var randomEchStrings = ["Just Echo", "Another Echo", "Whats up?", "Hello??", "Somebody out there?"];
var randomInvokeURLs = ["http://www.amazon.com","http://www.cnn.com","http://www.foxnews.com","http://www.twitter.com","http://www.facebook.com","http://www.orf.at","http://www.dynatrace.com"]
t = Date.now();
address = system.args[1];
var username = (system.args.length > 2) ? system.args[2] : randomUserNames[random(0, randomUserNames.length)]; 
var echostring = (system.args.length > 3) ? system.args[3] : randomEchStrings[random(0, randomEchStrings.length)];
var invokeURL = (system.args.length > 4) ? system.args[4] : randomInvokeURLs[random(0, randomInvokeURLs.length)];
console.log("Start URL: " + address);
console.log("Username: " + username);
console.log("EchoString: " + echostring);
console.log("InvokeURL: " + invokeURL);

// ======================================================================
// Step 1: Load the initial page
// ======================================================================
page.loading = true;
page.open(address, function(status) {
    if (status !== 'success') {
      console.log('FAIL to load the address');
    } else {
      t = Date.now() - t;
      console.log('Loading ' + system.args[1]);
      console.log('Loading time ' + t + ' msec');
    }
	page.loading = false;
});
phantom.waitFor(function() {return !page.loading;});
var currResultText = page.evaluate(function(id) {return document.getElementById(id).innerText;}, "result");
console.log("Current Result Text: " + currResultText);

// ======================================================================
// Step 2: Click on Echo
// ======================================================================
console.log("CLICK ON ECHO");
page.evaluateJavaScript("function() { $('#SayText').val('" + echostring + "'); }");
page.evaluateJavaScript("function() { $('#Echo').click(); }");
phantom.waitFor(function() {return page.evaluate(function(id) {return document.getElementById(id).innerText;}, "result") != currResultText});
currResultText = page.evaluate(function(id) {return document.getElementById(id).innerText;}, "result");
console.log("Current Result Text: " + currResultText);

// ======================================================================
// Step 3: Click on Invoke
// ======================================================================
console.log("CLICK ON INVOKE");
page.evaluateJavaScript("function() { $('#RemoteURL').val('" + invokeURL + "'); }");
page.evaluateJavaScript("function() { $('#Invoke').click(); }");
phantom.waitFor(function() {return page.evaluate(function(id) {return document.getElementById(id).innerText;}, "result") != currResultText});
currResultText = page.evaluate(function(id) {return document.getElementById(id).innerText;}, "result");
console.log("Current Result Text: " + currResultText);

// ======================================================================
// Step 4: Login
// ======================================================================
console.log("CLICK ON LOGIN");
page.evaluateJavaScript("function() { $('#Username').val('" + username + "'); }");
page.evaluateJavaScript("function() { $('#Login').click(); }");
phantom.waitFor(function() {return page.evaluate(function(id) {return document.getElementById(id).innerText;}, "result") != currResultText});
currResultText = page.evaluate(function(id) {return document.getElementById(id).innerText;}, "result");
console.log("Current Result Text: " + currResultText);

console.log("DONE!!");

phantom.exit();