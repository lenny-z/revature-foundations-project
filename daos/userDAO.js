require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, QueryCommand, PutCommand } = require('@aws-sdk/lib-dynamodb');
const client = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocumentClient.from(client);
const uuid = require('uuid');
const USERS_TABLE = process.env.USERS_TABLE;
const USERNAME_INDEX = process.env.USERNAME_INDEX;
const EMPLOYEE_ROLE = process.env.EMPLOYEE_ROLE;
const MANAGER_ROLE = process.env.MANAGER_ROLE;

async function createUser(username, password, role = EMPLOYEE_ROLE) {
	const command = new PutCommand({
		TableName: USERS_TABLE,
		Item: {
			id: uuid.v4(),
			username,
			password,
			role: role === MANAGER_ROLE ? MANAGER_ROLE : EMPLOYEE_ROLE
		}
	});

	return await documentClient.send(command);
}

async function getUserByUsername(username) {
	const command = new QueryCommand({
		TableName: USERS_TABLE,
		IndexName: USERNAME_INDEX,
		KeyConditionExpression: 'username = :username',
		ExpressionAttributeValues: { ':username': username }
	});

	return await documentClient.send(command);
}

module.exports = {
	getUserByUsername,
	createUser
};