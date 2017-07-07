Here you find testing scripts that can be used to generate traffic against the applications we are hosting on AWS

# Node JS Beanstalk Traffic
The script [nodejsbeanstalktest.js](/nodejsbeanstalktest.js) uses [PhantomJS](http://phantomjs.org/download.html) which is a free head-less browser testing software.
The script has one mandatory and 3 optional parameters
``` 
Usage: nodejsbeanstalktest http://yournodejsbeanstalkurl [username] [echostring] [invokeurl]
```
The script will execute the following steps
1. Open your BeanStalk URL
2. Enters an Echo String and Clicks the Echo Button
3. Enters the Remote URL and hits Invoke Button
4. Eners the Username and hits Login
The script will use your defined parameters. If they are not present the script will use a meaningful random value.

## Running consistent load from Windows
The following can be used as a windows batch file to run these tests in an endless loop. Simply fill in your URL and PhantomJS location
```
set PHANTOMHOME=C:\phantomjs\phantomjs-2.1.1-windows\bin
set NODEJSURL=http://YOURURL.elasticbeanstalk.com/

:again
%PHANTOMHOME%/phantomjs nodejsbeanstalktest.js %NODEJSURL%
goto again
```

## Running consistent load from Linux
For linux we can do something very similar
```
EXPORT PHANTOMHOME=./phantomjs-2.1.1-linux-x86_64/bin/phantomjs
EXPORT NODEJSURL=http://YOURURL.elasticbeanstalk.com/

while true
do
  echo "Hit CTRL-C to stop";
  sleep 1;
  $PHANTOMHOME nodejsbeanstalktest.js $NODEJSURL
done
```
If you save this into a bash you can even run it in parallel and with that generate even more load!

Tip for AWS:
If you want to generate load from AWS I suggest to create an EC2 Linux Instance and use the following script in the User Data section:
```
#!/bin/bash
wget https://bitbucket.org/ariya/phantomjs/downloads/phantomjs-2.1.1-linux-x86_64.tar.bz2
tar -xvf phantomjs-2.1.1-linux-x86_64.tar.bz2
wget https://raw.githubusercontent.com/Dynatrace/AWSMonitoringTutorials/master/TestingScripts/nodejsbeanstalktest.js

EXPORT PHANTOMHOME=./phantomjs-2.1.1-linux-x86_64/bin/phantomjs
EXPORT NODEJSURL=http://YOURURL.elasticbeanstalk.com/

while true
do
  echo "Hit CTRL-C to stop";
  sleep 1;
  $PHANTOMHOME nodejsbeanstalktest.js $NODEJSURL
done
``` 
