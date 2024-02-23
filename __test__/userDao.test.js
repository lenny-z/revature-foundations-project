require('dotenv').config();
const userDAO = require('../daos/userDAO.js');

test('createUser', async () => {
	const username = Math.random().toString(36);
	const password = Math.random().toString(36);
	// console.log(username);
	await userDAO.createUser(username, password);
	const user = (await userDAO.getUserByUsername(username)).Items[0];
	expect(user.username).toBe(username);
});