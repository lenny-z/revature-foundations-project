const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userDAO = require('../daos/userDAO.js');
const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;
const NUM_SALT_ROUNDS = parseInt(process.env.NUM_SALT_ROUNDS);

router.post('/register', async (req, res) => {
	try {
		const data = await userDAO.getUserByUsername(req.body.username);

		if (data.Items.length > 0) {
			res.sendStatus(409);
		} else {
			const saltedPasswordHash = await bcrypt.hash(req.body.password, NUM_SALT_ROUNDS);
			await userDAO.createUser(req.body.username, saltedPasswordHash);
			res.sendStatus(201);
		}
	} catch (err) {
		res.sendStatus(500);
		console.error(err);
	}
});

router.post('/login', async (req, res) => {
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
});

function authorize(req, res, next) {
	const header = req.headers['authorization'];

	if (!header) {
		res.sendStatus(401);
	} else {
		const token = header.split(' ')[1];

		if (!token) {
			res.status(401);
		} else {
			jwt.verify(token, JWT_SECRET, (err, user) => {
				if (err) {
					res.status(401);
				} else {
					req.user = user;
					next();
				}
			});
		}
	}
}

module.exports = {
	router,
	authorize
};