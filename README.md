# aws-sam-local-with-dynamodb-freelancer

This application allows to create, update, edit, delete and list users, with first, last name and address fields.

 It utilizes a fully serverless architecture:

 - API Gateway for REST API
 - Lambda and DynamoDB as a Backend
 - CloudFormation and SAM for Infrastructure management
 - S3 to serve the WebSite

The application utilizes Ember.js methodology by abstracting API Gateway communication into adapters, allowing you to write controller code utilizing ember models.

This application run locally (in a docker lambda and docker DynamoDB) and on the AWS Cloud.

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with NPM)
* [Docker](https://www.docker.com/get-started)
* [AWS CLI](https://aws.amazon.com/cli)
* [SAM CLI](https://docs.aws.amazon.com/pt_br/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html)
* [Ember CLI](https://ember-cli.com/)

## Installation

* `git clone https://github.com/computationalcore/aws-sam-local-with-dynamodb-freelancer`
* `cd aws-sam-local-with-dynamodb-freelancer`

--------------------

### Run Locally

#### Cloud (Local)

Create a specific Docker network beforehand named the lambda-local-network (rename it if you want):

```bash
docker network create lambda-local-network
```

Create a dynamoDB container

```bash
docker run -d -p 8000:8000 --network=lambda-local-network --name dynamodb-local amazon/dynamodb-local -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```

Create Users table

```bash
aws dynamodb create-table --table-name UsersTable --attribute-definitions AttributeName=id,AttributeType=S --key-schema AttributeName=id,KeyType=HASH --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5 --endpoint-url http://0.0.0.0:8000
```

Enter cloud folder and start the SAM locally

```bash
cd cloud/
```

```bash
sam local start-api --docker-network lambda-local-network
```

The API  is up and running at http://127.0.0.1:3000/

#### Client (Local)

At another terminal instance enter client folder and install dependencies

```bash
cd aws-sam-client/
npm install
```

Start local server

```bash
ember serve --port 5000
```

The JS client is up and running at http://127.0.0.1:5000/

--------------------

### Run at AWS Cloud

#### Cloud

Go to cloud folder

```bash
cd cloud/
```

##### Creating the AWS Infrastructure

***Please NOTE: the following steps will incur charges on your AWS account, please see the appropriate pricing pages for the services***

Create an S3 bucket in the location where you want to save the packaged code. If you want to use an existing S3 bucket, skip this step.

```bash
aws s3 mb s3://bucketname
```

Create the Lambda function deployment package by running the following package AWS SAM CLI command at the command prompt.

```bash
sam package \
    --output-template-file packaged.yaml \
    --s3-bucket bucketname
```

In the AWS SAM CLI, use the deploy command to deploy all of the resources that you defined in the template.

```bash
sam deploy \
    --template-file packaged.yaml \
    --stack-name sam-app \
    --capabilities CAPABILITY_IAM \
    --region us-east-1
```

Go to AWS Lambda panel API Gateway to check your URL.

#### Client

Yet in cloud folder create the client template named ember-serverless-hosting (you are free to change this name)

```bash
aws cloudformation describe-stacks --stack-name ember-serverless-hosting
```

Note the `OutputValue` value for the `CodeBucketName` S3 bucket, this will be the bucket we use to deploy our Lambda code to.

Go to client folder install dependencies and build the project

```bash
cd aws-sam-client/
npm install
ember build --environment production
```

Change the value of aws-sam-client/config/environment.js from webServiceURL from 'http://localhost:3000' to the AWS Lambda panel API Gateway URL of the cloud.

##### Deploying the Web Application

Build the ember app and copy it to S3, note you'll need the "WebsiteBucket" output value from the above hosting cloudformation stack you generated. If you need it again, just run `aws cloudformation describe-stacks --stack-name ember-serverless-hosting` *if you used a different name, substitute that in-place of "ember-serverless-hosting", then note the `OutputValue` for "WebsiteBucket" and use that here:

```bash
aws s3 sync dist/ s3://<<your-ember-website-bucket>>/ -acl public-read
```

Once synced you can visit the URL for your S3 bucket using the `OutputValue` from the hosting template for `WebsiteURL`.

## Authors

Vin Busquet - [https://github.com/computationalcore](https://github.com/computationalcore)
