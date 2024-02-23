const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const client = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocumentClient.from(client);
const uuid = require('uuid');
const TICKETS_TABLE = process.env.TICKETS_TABLE;

async function createTicket(amount, description) {
	const command = new PutCommand({
		TableName: TICKETS_TABLE,
		Item: { id: uuid.v4(), amount, description, status: 'PENDING' }
	});

	const data = await documentClient.send(command);
	return data;
}

module.exports = {
	createTicket
};