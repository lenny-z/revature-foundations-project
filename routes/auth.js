const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userDAO = require('../daos/userDAO.js');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const MANAGER_ROLE = process.env.MANAGER_ROLE;
const NUM_SALT_ROUNDS = parseInt(process.env.NUM_SALT_ROUNDS);

async function register(req, res) {
	try {
		const data = await userDAO.getUserByUsername(req.body.username);

		if (data.Items.length > 0) {
			res.status(400).json({ error: 'USERNAME EXISTS' });
		} else {
			const saltedPasswordHash = await bcrypt.hash(req.body.password, NUM_SALT_ROUNDS);
			await userDAO.createUser(req.body.username, saltedPasswordHash);
			res.sendStatus(201);
		}
	} catch (err) {
		res.sendStatus(500);
		console.error(err);
	}
}

// router.post('/login', async (req, res) => {
// 	try {
// 		const data = await userDAO.getUserByUsername(req.body.username);

// 		if (data.Items.length === 0) {
// 			res.sendStatus(400);
// 		} else {
// 			const user = data.Items[0];

// 			if (await bcrypt.compare(req.body.password, user.password)) {
// 				const token = jwt.sign(
// 					{
// 						id: user.id,
// 						username: user.username,
// 						role: user.role
// 					},
// 					JWT_SECRET,
// 					{
// 						expiresIn: '15m'
// 					}
// 				);

// 				res.json({ token });
// 			} else {
// 				res.sendStatus(400);
// 			}
// 		}
// 	} catch (err) {
// 		res.sendStatus(500);
// 		console.error(err);
// 	}
// });

async function login(req, res) {
	try {
		const data = await userDAO.getUserByUsername(req.body.username);

		if (data.Items.length === 0) {
			res.sendStatus(400);
		} else {
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

				res.json({ token });
			} else {
				res.sendStatus(400);
			}
		}
	} catch (err) {
		res.sendStatus(500);
		console.error(err);
	}
}

function authorize(req, res, next) {
	const header = req.headers['authorization'];

	if (!header) {
		res.sendStatus(401);
	} else {
		const token = header.split(' ')[1];

		if (!token) {
			res.sendStatus(401);
		} else {
			jwt.verify(token, JWT_SECRET, (err, user) => {
				if (err) {
					res.sendStatus(401);
				} else {
					req.user = user;
					next();
				}
			});
		}
	}
}

function authorizeManager(req, res, next) {
	const header = req.headers['authorization'];

	if (!header) {
		res.sendStatus(401);
	} else {
		const token = header.split(' ')[1];

		if (!token) {
			res.sendStatus(401);
		} else {
			jwt.verify(token, JWT_SECRET, (err, user) => {
				if (err) {
					res.sendStatus(401);
				} else if (!user.role || user.role !== MANAGER_ROLE) {
					res.sendStatus(403);
				} else {
					req.user = user;
					next();
				}
			});
		}
	}
}

module.exports = {
	// router,
	login,
	register,
	authorize,
	authorizeManager
};