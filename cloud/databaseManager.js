'use strict';

const AWS = require('aws-sdk');

if (process.env.AWS_SAM_LOCAL) {
  AWS.config.update({
    region: 'local',
    endpoint: "http://dynamodb-local:8000",
    maxRetries: 0
  });
}

let dynamo = new AWS.DynamoDB.DocumentClient();

const TABLE_NAME = 'UsersTable';

module.exports.initializateDynamoClient = newDynamo => {
  dynamo = newDynamo;
};

module.exports.saveItem = item => {
  const params = {
    TableName: TABLE_NAME,
    Item: item
  };

  return dynamo
    .put(params)
    .promise()
    .then((result) => {
      return {'user': item};
    }, (error) => {
      return error;
    });
};

module.exports.getItem = itemId => {
  const params = {
    Key: {
      id: itemId
    },
    TableName: TABLE_NAME
  };

  return dynamo
    .get(params)
    .promise()
    .then((result) => {
      return {'user': result.Item};
    }, (error) => {
      return error;
    });
};

module.exports.getItems = () => {
  const params = {
    TableName: TABLE_NAME
  };

  return dynamo
    .scan(params)
    .promise()
    .then((result) => {
      return {'users': result.Items};
    }, (error) => {
      return error;
    });
};


module.exports.deleteItem = itemId => {
  const params = {
    Key: {
      id: itemId
    },
    TableName: TABLE_NAME
  };

  return dynamo.delete(params).promise();
};

module.exports.updateItem = (itemId, item) => {

  let vbl = "x";
  let adder = "y";
  let updateexp = 'set ';
  let itemKeys = Object.keys(item);
  let expattvalues = {};

  for (let i = 0; i < itemKeys.length; i++) {
    vbl = vbl + adder;

    if ((itemKeys.length - 1) == i)
      updateexp += itemKeys[i] + ' = :' + vbl;
    else
      updateexp += itemKeys[i] + ' = :' + vbl + ", ";

    expattvalues[":" + vbl] = item[itemKeys[i]];
  }

  console.log("update expression and expressionAttributeValues");
  console.log(updateexp, expattvalues);

  const params = {
    TableName: TABLE_NAME,
    Key: {
      id: itemId
    },
    ConditionExpression: 'attribute_exists(id)',
    UpdateExpression: updateexp,
    ExpressionAttributeValues: expattvalues,
    ReturnValues: 'ALL_NEW'
  };

  return dynamo
    .update(params)
    .promise()
    .then(response => {
      return response.Attributes;
    }, (error) => {
      return error;
    });
};