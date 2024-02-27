require('dotenv').config();
const express = require('express');
const { login, register } = require('./routes/auth.js');
const ticketsRouter = require('./routes/tickets.js');
const PORT = 3000;

const app = express();
app.use(express.json());
app.use('/login', login);
app.use('/register', register);
app.use('/tickets', ticketsRouter);

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}.`);
});