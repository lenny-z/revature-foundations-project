require('dotenv').config();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userDAO = require('../daos/userDAO.js');
const JWT_SECRET = process.env.JWT_SECRET;
const MANAGER_ROLE = process.env.MANAGER_ROLE;
const NUM_SALT_ROUNDS = parseInt(process.env.NUM_SALT_ROUNDS);

async function register(req, res) {
	if (!req.body || !req.body.username || !req.body.password) {
		res.sendStatus(400);
		return;
	}

	try {
		const data = await userDAO.getUserByUsername(req.body.username);

		if (data.Items.length > 0) {
			res.status(400).json({ error: 'USERNAME EXISTS' });
			return;
		}

		const saltedPasswordHash = await bcrypt.hash(req.body.password, NUM_SALT_ROUNDS);
		await userDAO.createUser(req.body.username, saltedPasswordHash, req.body.role);
		res.sendStatus(201);
	} catch (err) {
		res.sendStatus(500);
		console.error(err);
	}
}

async function login(req, res) {
	if (!req.body || !req.body.username || !req.body.password) {
		res.sendStatus(400);
		return;
	}

	try {
		const data = await userDAO.getUserByUsername(req.body.username);

		if (data.Items.length === 0) {
			res.sendStatus(400);
			return;
		}

		const user = data.Items[0];

		if (await bcrypt.compare(req.body.password, user.password)) {
			const token = jwt.sign(
				{
					id: user.id,
					username: user.username,
					role: user.role
				},
				JWT_SECRET,
				{
					expiresIn: '15m'
				}
			);

			res.status(200).json({ token });
			return;
		}
		res.sendStatus(400);
	} catch (err) {
		res.sendStatus(500);
		console.error(err);
	}
}

function authorize(req, res, next) {
	const header = req.headers['authorization'];
	
	if (!header) {
		res.sendStatus(401);
		return;
	}
	
	const token = header.split(' ')[1];
	
	if (!token) {
		res.sendStatus(401);
		return;
	}
	
	jwt.verify(token, JWT_SECRET, (err, user) => {
		if (err) {
			res.sendStatus(401);
			console.error(err);
			return;
		}

		req.user = user;
		next();
	});
}

const authorizeManager = [
	authorize,
	(req, res, next) => {
		if (req.user.role !== MANAGER_ROLE) {
			res.sendStatus(403);
			return;
		}

		next();
	}
]

module.exports = {
	login,
	register,
	authorize,
	authorizeManager
};