require('dotenv').config();
const userDAO = require('../daos/userDAO.js');
const EMPLOYEE_ROLE = process.env.EMPLOYEE_ROLE;
const MANAGER_ROLE = process.env.MANAGER_ROLE;

test('createUser and getUserByUsername, employee', async () => {
	const username = Math.random().toString(36);
	const password = Math.random().toString(36);
	await userDAO.createUser(username, password);
	const user = (await userDAO.getUserByUsername(username)).Items[0];
	expect(user.username).toBe(username);
	expect(user.role).toBe(EMPLOYEE_ROLE);
});

test('createUser and getUserByUsername, manager', async() => {
	const username = Math.random().toString(36);
	const password = Math.random().toString(36);
	await userDAO.createUser(username, password, MANAGER_ROLE);
	const user = (await userDAO.getUserByUsername(username)).Items[0];
	expect(user.username).toBe(username);
	expect(user.role).toBe(MANAGER_ROLE)
});