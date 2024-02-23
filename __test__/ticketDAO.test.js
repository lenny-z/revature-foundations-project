const ticketDAO = require('../daos/ticketDAO.js');

test('createTicket', async () => {
	const amount = Math.random() * 100;
	const description = Math.random().toString(36);
	await ticketDAO.createTicket(amount, description);
	const data = await ticketDAO.getTicketsByStatus('PENDING');
	const ticket = data.Items.find(
		ticket => ticket.amount === amount && ticket.description === description
	);
	expect(ticket).not.toBeNull();
});