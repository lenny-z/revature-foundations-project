require('dotenv').config();
const express = require('express');
const authRouter = require('./routes/auth.js');
const PORT = 3000;

const app = express();
app.use(express.json());
app.use('/auth', authRouter);

app.listen(PORT, () => {
	console.log(`App listening on port ${PORT}.`);
});