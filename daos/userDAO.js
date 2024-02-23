require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const client = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocumentClient.from(client);
const uuid = require('uuid');
const USERS_TABLE = process.env.USERS_TABLE;
const USERNAME_INDEX = process.env.USERNAME_INDEX;

async function createUser(username, password) {
	const command = new PutCommand({
		TableName: USERS_TABLE,
		Item: { id: uuid.v4(), username, password }
	});

	const data = await documentClient.send(command);
	return data;
}

async function getUserByUsername(username) {
	const command = new QueryCommand({
		TableName: USERS_TABLE,
		IndexName: USERNAME_INDEX,
		KeyConditionExpression: 'username = :username',
		ExpressionAttributeValues: { ':username': username }
	});

	const data = await documentClient.send(command);
	return data;
}

module.exports = {
	getUserByUsername,
	createUser
};