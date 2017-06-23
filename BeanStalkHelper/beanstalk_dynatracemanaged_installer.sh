#!/bin/bash

#######
# This script queries the full download link of your Dynatrace Managed OneAgent
# Only to be used in AWS Elastic Beanstalk environments
# Don't modify this file!
#######

if [ -z "$BASH_VERSION" ]
then
  exec bash "$0" "$@"
fi

function remove_me(){
  echo "Removing file: $0"
  rm -- "$0"
}

function quit(){
  exit 0
}

#if [ (! -d /opt/ruxit/agent) && (! -d /opt/dynatrace/oneagent) ]
#then
  # Sample value for DYNATRACE_MANAGED_ONEAGENT_DOWNLOAD - https://dynatrace-managed.dxs-platform.com/e/aa65eae4-951b-4647-9f0d-fca5825ee1da/installer/oneagent/unix/latest/FGRTTedQGc5L7WTH
  DYNATRACE_MANAGED_ONEAGENT_DOWNLOAD=$(/opt/elasticbeanstalk/bin/get-config environment -k DYNATRACE_MANAGED_ONEAGENT_DOWNLOAD --output YAML | awk '/DYNATRACE_MANAGED_ONEAGENT_DOWNLOAD/ {print $2}')

  #since AMI2016.03 get-config has changed - retry if RUXIT_* is empty
  if [ "x$DYNATRACE_MANAGED_ONEAGENT_DOWNLOAD" == "x" ]
  then
    DYNATRACE_MANAGED_ONEAGENT_DOWNLOAD=$(/opt/elasticbeanstalk/bin/get-config environment -k DYNATRACE_MANAGED_ONEAGENT_DOWNLOAD)
  fi

  [ "x$DYNATRACE_MANAGED_ONEAGENT_DOWNLOAD" == "x" ] && echo "Need to set DYNATRACE_MANAGED_ONEAGENT_DOWNLOAD" && remove_me && quit;

  echo "Trying to download Dynatrace OneAgent..."

  if which curl >/dev/null;
  then
    curl_output=$(curl -L -o /tmp/Dynatrace-OneAgent-Linux.sh $DYNATRACE_MANAGED_ONEAGENT_DOWNLOAD)
    [ $? -ne 0 ] && echo "curl failed! - $curl_output" && remove_me && quit;
  elif which wget >/dev/null;
  then
    wget_output=$(wget --no-check-certificate -O /tmp/Dynatrace-OneAgent-Linux.sh $DYNATRACE_MANAGED_ONEAGENT_DOWNLOAD)
    [ $? -ne 0 ] && echo "wget failed! - $wget_output" && remove_me && quit;
  else
    echo "No wget or curl found to download Dynatrace OneAgent"
    remove_me
    quit
  fi

  echo "Trying to install Dynatrace OneAgent..."
  chmod 755 /tmp/Dynatrace-OneAgent-Linux.sh
  chown root:root /tmp/Dynatrace-OneAgent-Linux.sh
  /tmp/Dynatrace-OneAgent-Linux.sh APP_LOG_CONTENT_ACCESS=1 

#else
#  echo "Dynatrace already installed - skip new installation"
#fi
remove_me
