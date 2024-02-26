require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
	DynamoDBDocumentClient,
	PutCommand,
	QueryCommand,
	UpdateCommand
} = require('@aws-sdk/lib-dynamodb');
const client = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocumentClient.from(client);
const uuid = require('uuid');
const TICKETS_TABLE = process.env.TICKETS_TABLE;
const TICKET_STATUS_INDEX = process.env.TICKET_STATUS_INDEX;
const PENDING_TICKET_STATUS = process.env.PENDING_TICKET_STATUS;
const APPROVED_TICKET_STATUS = process.env.APPROVED_TICKET_STATUS;

async function createTicket(amount, description) {
	const command = new PutCommand({
		TableName: TICKETS_TABLE,
		Item: { id: uuid.v4(), amount, description, status: PENDING_TICKET_STATUS }
	});

	const data = await documentClient.send(command);
	return data;
}

async function getTicketsByStatus(status) {
	const command = new QueryCommand({
		TableName: TICKETS_TABLE,
		IndexName: TICKET_STATUS_INDEX,
		KeyConditionExpression: '#status = :status',
		ExpressionAttributeValues: { ':status': status },
		ExpressionAttributeNames: { '#status': 'status' }
	});

	const data = await documentClient.send(command);
	return data;
}

async function approveTicket(id) {
	const command = new UpdateCommand({
		TableName: TICKETS_TABLE,
		Key: { id: id },
		UpdateExpression: 'set #status = :status',
		ExpressionAttributeValues: { ':status': APPROVED_TICKET_STATUS },
		ExpressionAttributeNames: { '#status': 'status' }
	});

	const data = await documentClient.send(command);
	return data;
}

module.exports = {
	createTicket,
	getTicketsByStatus,
	approveTicket
};