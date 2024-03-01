require('dotenv').config();
const ticketDAO = require('../daos/ticketDAO.js');
// const PENDING_TICKET_STATUS = process.env.PENDING_TICKET_STATUS;
// const APPROVED_TICKET_STATUS = process.env.APPROVED_TICKET_STATUS;
// const DENIED_TICKET_STATUS = process.env.DENIED_TICKET_STATUS;

test('createTicket, managerGetPendingTickets, and employeeGetTickets', async () => {
	const submitterID = Math.random().toString(36);
	const amount = Math.random() * 100;
	const description = Math.random().toString(36);
	await ticketDAO.createTicket(submitterID, amount, description);
	let tickets = (await ticketDAO.getPendingTickets()).Items;
	let ticket = tickets.find(ticket => {
		ticket.submitterID === submitterID &&
			ticket.amount === amount &&
			ticket.description === description
	});
	expect(ticket).not.toBeNull();
	tickets = (await ticketDAO.getTicketsBySubmitterID(submitterID)).Items;
	ticket = tickets.find(ticket => {
		ticket.submitterID === submitterID &&
			ticket.amount === amount &&
			ticket.description === description
	});
	expect(ticket).not.toBeNull();
});

async function testTicketStatusSetter(setter) {
	let data = await ticketDAO.getPendingTickets();
	const tickets = data.Items;
	const randomTicket = tickets[Math.floor(Math.random() * tickets.length)];
	data = await setter(randomTicket.submitterID);
	// console.log(data);
	expect(data.$metadata.httpStatusCode).toBe(200);
	// data = await setter(randomTicket.id);
	// console.log(data);
	// expect(data.$metadata.httpStatusCode).toBe(400);
}

test('approveTicket', async () => {
	await testTicketStatusSetter(ticketDAO.approveTicket);
});

test('denyTicket', async () => {
	await testTicketStatusSetter(ticketDAO.denyTicket);
});