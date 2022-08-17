#!/usr/bin/env bash

required_commands="node npm"

for command_name in ${required_commands}
do
  if ! command -v "${command_name}" &> /dev/null; then
    echo "${command_name} is required, please install \"node\" version v16. See: https://nodejs.org/en/"
    exit 1
  fi
done

if ! node --version | grep -q "v16"; then
  echo "node version v16 is required";
  exit 1
fi

echo "\"node\" version v16 is installed.";

if ! command -v sam &> /dev/null; then
  echo "\"sam\" is not installed. Install \"sam\" to enable local and integration testing.  See: https://aws.amazon.com/serverless/sam/"
else
  echo "\"sam\" is installed."
fi

if ! command -v docker &> /dev/null; then
  echo "\"docker\" is not installed. Install \"docker\" to enable local and integration testing.  See: https://docs.docker.com/get-docker/"
else
  echo "The docker command is installed."
  if ! docker ps -q &> /dev/null; then
    echo 'Docker is not running. To enable local and integration testing with "sam", start the docker service on your local computer.'
  else
    echo "Docker is running."
  fi
fi

if ! command -v aws &> /dev/null; then
  echo "\"aws\" is not installed. Install \"aws\" to enable local and integration testing.  See: https://aws.amazon.com/cli/"
else
  echo "\"aws\" is installed."
fi
