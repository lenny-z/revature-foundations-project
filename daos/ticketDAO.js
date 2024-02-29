require('dotenv').config();
const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
const {
	DynamoDBDocumentClient,
	GetCommand,
	PutCommand,
	QueryCommand,
	UpdateCommand
} = require('@aws-sdk/lib-dynamodb');
const client = new DynamoDBClient({ region: 'us-east-1' });
const documentClient = DynamoDBDocumentClient.from(client);
const uuid = require('uuid');
const TICKETS_TABLE = process.env.TICKETS_TABLE;
const TICKET_STATUS_INDEX = process.env.TICKET_STATUS_INDEX;
const TICKET_SUBMITTER_ID_INDEX = process.env.TICKET_SUBMITTER_ID_INDEX;
const PENDING_TICKET_STATUS = process.env.PENDING_TICKET_STATUS;
const APPROVED_TICKET_STATUS = process.env.APPROVED_TICKET_STATUS;
const DENIED_TICKET_STATUS = process.env.DENIED_TICKET_STATUS;

async function createTicket(submitterID, amount, description) {
	const command = new PutCommand({
		TableName: TICKETS_TABLE,
		Item: {
			id: uuid.v4(),
			submitterID,
			amount,
			description,
			status: PENDING_TICKET_STATUS
		}
	});

	return await documentClient.send(command);
}

async function getTicketByID(id) {
	const command = new GetCommand({
		TableName: TICKETS_TABLE,
		Key: { id: id }
	});

	return await documentClient.send(command);
}

async function managerGetPendingTickets() {
	const command = new QueryCommand({
		TableName: TICKETS_TABLE,
		IndexName: TICKET_STATUS_INDEX,
		KeyConditionExpression: '#status = :status',
		ExpressionAttributeValues: { ':status': PENDING_TICKET_STATUS },
		ExpressionAttributeNames: { '#status': 'status' }
	});

	return await documentClient.send(command);
}

async function employeeGetTickets(id) {
	const command = new QueryCommand({
		TableName: TICKETS_TABLE,
		IndexName: TICKET_SUBMITTER_ID_INDEX,
		KeyConditionExpression: 'submitterID = :submitterID',
		ExpressionAttributeValues: { ':submitterID': id }
	});

	return await documentClient.send(command);
}

async function setTicketStatus(id, status) {
	const command = new UpdateCommand({
		TableName: TICKETS_TABLE,
		Key: { id: id },
		UpdateExpression: 'set #status = :status',
		ExpressionAttributeValues: { ':status': status },
		ExpressionAttributeNames: { '#status': 'status' }
	});

	return await documentClient.send(command);
}

async function approveTicket(id) {
	return await setTicketStatus(id, APPROVED_TICKET_STATUS);
}

async function denyTicket(id) {
	return await setTicketStatus(id, DENIED_TICKET_STATUS);
}

module.exports = {
	createTicket,
	getTicketByID,
	managerGetPendingTickets,
	employeeGetTickets,
	approveTicket,
	denyTicket
};