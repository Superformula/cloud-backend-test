#!/bin/bash

set -e

# Installing only prod dependencies because of 250MB limitation
# https://docs.aws.amazon.com/lambda/latest/dg/gettingstarted-limits.html
echo "## Installing prd dependencies..."
npm install --only=prod --loglevel=warn
npm run build -- --project tsconfig.prod.json

AWS_CREDS_FILE=~/.aws/credentials
if [[ ! -e ~/.aws/credentials ]]; then
    mkdir ~/.aws
    touch $AWS_CREDS_FILE
    chmod 600 $AWS_CREDS_FILE
fi

grep -qF -- "[graphql-deploy]" ~/.aws/credentials || cat << EndOfFile >> $AWS_CREDS_FILE
[graphql-deploy]
aws_access_key_id=${AWS_ACCESS_KEY_ID}
aws_secret_access_key=${AWS_SECRET_ACCESS_KEY}
EndOfFile

echo "## Check for existing nodejs directory..."
if [[ ! -e nodejs ]]; then
    echo "## Deleting nodejs zip"
    rm -rf nodejs.zip
        echo "## Creating nodejs directory..."
    mkdir nodejs
fi
cd nodejs
cp -r ../node_modules node_modules
cp ../package.json .
cp ../schema.graphql ../dist
cd .. || exit
npm run zip:nodejs

npm run cdk -- deploy --profile graphql-deploy -o cdk.out

echo "## Cleaning up..."
rm -r nodejs
rm -r nodejs.zip
