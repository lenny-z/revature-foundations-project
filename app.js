const express = require('express');
const authRouter = require('./routes/auth.js');
// const { getUserByUsername, createUser } = require('./daos/userDAO.js');
const PORT = 3000;

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

// getUserByUsername('John');

// app.post('/register', async (req, res) => {
// 	// console.log(req.body);

// 	try {
// 		let data = await getUserByUsername(req.body.username);

// 		if (data.Items.length > 0) {
// 			res.sendStatus(409);
// 		} else {
// 			// console.log(await createUser(req.body.username, req.body.password));
// 			await createUser(req.body.username, req.body.password);
// 			res.sendStatus(201);
// 		}
// 	} catch (err) {
// 		res.sendStatus(500);
// 	}
// });

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}.`);
});