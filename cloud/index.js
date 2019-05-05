'use strict';

const databaseManager = require('./databaseManager');
const uuidv1 = require('uuid/v1');

exports.userHandler = function(event, context, callback){

    console.log(event, context);

    switch (event.httpMethod) {
			case 'DELETE':
				deleteItem(event, callback);
				break;
			case 'GET':
				getItem(event, callback);
				break;
			case 'POST':
				saveItem(event, callback);
				break;
			case 'PUT':
				updateItem(event, callback);
				break;
			default:
				sendResponse(404, `Unsupported method "${event.httpMethod}"`, callback);
	}
};

function saveItem(event, callback) {
	const item = JSON.parse(event.body);

	item.id = uuidv1();

	databaseManager.saveItem(item).then(response => {
		sendResponse(200, {"report": item.id}, callback);
	}, (reject) =>{
		sendResponse(400, reject, callback);
	});
}

function getItem(event, callback) {
	if (event.pathParameters) {
		const itemId = event.pathParameters.id;
		databaseManager.getItem(itemId).then(response => {
			if(response)
				sendResponse(200, response, callback);
			else
			sendResponse(404, "Please provide a valid user id", callback);
	
		},(reject) =>{
			sendResponse(400, reject, callback);
		});
	}
	else {
		databaseManager.getItems().then(response => {
			if(response)
				sendResponse(200, response, callback);
			else
			sendResponse(404, "No data available", callback);
	
		},(reject) =>{
			sendResponse(400, reject, callback);
		});
	}	
}

function deleteItem(event, callback) {
	const itemId = event.pathParameters.id;

	databaseManager.deleteItem(itemId).then(response => {
		sendResponse(200, 'DELETE ITEM', callback);
	}, (reject) => {
		sendResponse(400, reject, callback);
	});
}

function updateItem(event, callback) {
	const itemId = event.pathParameters.id;

	const body = JSON.parse(event.body);
	
	databaseManager.updateItem(itemId, body).then(response => {
		sendResponse(200, response, callback);
	}, (reject) => {
		sendResponse(400, reject, callback);
	});
}

function sendResponse(statusCode, message, callback) {
	const response = {
		headers: {
			"Access-Control-Allow-Headers": "Content-Type,X-Amz-Date,Authorization,X-Api-Key",
			"Access-Control-Allow-Methods": "POST, GET, PUT, DELETE",
			"Access-Control-Allow-Origin": "*"
		},
		statusCode: statusCode,
		body: JSON.stringify(message)
	};
	callback(null, response);
}