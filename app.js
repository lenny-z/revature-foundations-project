require('dotenv').config();
const express = require('express');
const authRouter = require('./routes/auth.js');
const ticketsRouter = require('./routes/tickets.js');
const PORT = 3000;

// const ticketDAO = require('./daos/ticketDAO.js');

const app = express();
app.use(express.json());
app.use('/auth', authRouter);
app.use('/tickets', ticketsRouter);

// app.post('/tickets', async (req, res) => {
// 	await ticketDAO.createTicket(req.body.amount, req.body.description);
// 	res.sendStatus(201);
// });

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}.`);
});