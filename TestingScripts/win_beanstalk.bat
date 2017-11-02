REM this script will run in an infinite loop and executes the nodejs phantom js script
REM make sure to set the following environment variables: PHANTOMHOME, NODEJSURL
set PHANTOMHOME=C:\phantomjs\phantomjs-2.1.1-windows\bin
set NODEJSURL=http://custom-env.ub2cp9hmpy.us-west-2.elasticbeanstalk.com/

:again
%PHANTOMHOME%/phantomjs nodejsbeanstalktest.js %NODEJSURL%
goto again