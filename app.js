// const { DynamoDBClient } = require('@aws-sdk/client-dynamodb');
// const { DynamoDBDocumentClient, PutCommand } = require('@aws-sdk/lib-dynamodb');
const express = require('express');
// const client = new DynamoDBClient({ region: 'us-east-1' });
// const documentClient = DynamoDBDocumentClient.from(client);
// const uuid = require('uuid');
const app = express();
app.use(express.json());
const PORT = 3000;
// const USERS_TABLE = 'users';
const { getUserByUsername, createUser } = require('./daos/userDAO.js');

getUserByUsername('John');

app.post('/register', async (req, res) => {
	console.log(req.body);

	try {
		console.log(await createUser(req.body.username, req.body.password));
		res.sendStatus(201);
	} catch (err) {
		res.sendStatus(500);
	}
});

// async function createUser(username, password) {
// 	const command = new PutCommand({
// 		TableName: USERS_TABLE,
// 		Item: { id: uuid.v4(), username, password }
// 	});

// 	// try{
// 	const data = await documentClient.send(command);
// 	return data;
// 	// }catch(error){

// 	// }
// }

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}.`);
});