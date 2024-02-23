// require('dotenv').config();
const userDAO = require('../daos/userDAO.js');

test('createUser and getUserByUsername', async () => {
	const username = Math.random().toString(36);
	const password = Math.random().toString(36);
	await userDAO.createUser(username, password);
	const user = (await userDAO.getUserByUsername(username)).Items[0];
	expect(user.username).toBe(username);
});