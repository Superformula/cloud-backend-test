#!/usr/bin/env bash

shopt -s expand_aliases

SOURCE_DIRECTORY=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
# shellcheck source=support/check-setup-dependencies.sh
source "${SOURCE_DIRECTORY}/check-setup-dependencies.sh"

alias npm_alias="npm"

if ! command -v npm &> /dev/null; then
  echo "npm is not installed."
  exit 1;
fi

if ! command -v pnpm &> /dev/null; then
  read -r -e -p "Do you want to install \"pnpm\"? [y/N]: " response
  if [[ "$response" == [Yy]* ]]; then
    if ! npm install -g pnpm; then
      echo "pnpm install failed."
      exit 1;
    else
      alias npm_alias="pnpm"
    fi
  fi
else
  alias npm_alias="pnpm"
fi

read -r -e -p "Do you want to install the project (node) dependencies? [y/N]: " response
if [[ "$response" == [Yy]* ]]; then
  if ! npm_alias install; then
    echo "dependency install failed."
    exit 1;
  fi
  echo "dependencies installed.";
else
  echo "skipping installing dependencies.";
fi

read -r -e -p "Do you want to compile (build) the project? [y/N]: " response
if [[ "$response" == [Yy]* ]]; then
  if ! npm_alias run build --stage dev --region us-east-1; then
    echo "project build failed."
    exit 1;
  fi
else
  echo "skipping project build.";
fi

read -r -e -p "Do you want to run the unit tests? [y/N]: " response
if [[ "$response" == [Yy]* ]]; then
  if ! npm_alias run coverage; then
    echo "unit tests failed."
    exit 1
  fi
else
  echo "skipping unit tests.";
fi

if command -v nc &> /dev/null && command -v sam &> /dev/null && command -v docker &> /dev/null && docker ps -q &> /dev/null; then
  read -r -e -p "Do you want to invoke the local Lambda function? [y/N]: " response
  if [[ "$response" == [Yy]* ]]; then
    if ! sam local invoke apiLambdaPOSTgraphql9D0A1996 --event ./__tests__/assets/event.json -t ./.build/cdk.out/dev-cloud-backend-test-Api.template.json; then
      echo "local invoke test failed."
      exit 1
    fi
    sam local start-api -t ./.build/cdk.out/dev-cloud-backend-test-Api.template.json &
    if [ $? -gt 0 ]; then
      echo "local start-api test failed."
      exit 1
    fi
    sam_pid=$!
    while ! nc -q0 127.0.0.1 3000 < /dev/null > /dev/null 2>&1; do
      sleep 2
    done
    curl --header "Content-Type: application/json" \
      --request POST \
      --data '{"query": "query { coordinate(address: \"New York City, New York, USA\") { \n... on QueryCoordinateSuccess { \n__typename \ndata {\nlatitude\nlongitude\n}\n}\n... on Error {\n__typename\nmessage\n}\n} }"}' \
      http://127.0.0.1:3000/graphql
    if [ $? -gt 0 ]; then
      echo "curl request to local start-api test failed."
      kill ${sam_pid}
      exit 1
    fi
    kill ${sam_pid}
    if command -v aws; then
      sam local start-lambda -t ./.build/cdk.out/dev-cloud-backend-test-Api.template.json &
      if [ $? -gt 0 ]; then
        echo "local start-lambda test failed."
        exit 1
      fi
      sam_pid=$!

      while ! nc -q0 127.0.0.1 3001 < /dev/null > /dev/null 2>&1; do
        sleep 2
      done
    
      if ! aws lambda invoke --function-name "apiLambdaPOSTgraphql9D0A1996" --payload file://__tests__/assets/event.json --endpoint-url "http://127.0.0.1:3001" --no-verify-ssl /dev/null; then
        echo "aws-cli start-lambda test failed."
        kill ${sam_pid}
        exit 1
      fi
      kill ${sam_pid}
    fi
  else
    echo "skipping local Lambda tests.";
  fi
fi
