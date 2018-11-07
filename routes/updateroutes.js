'use strict';

const routes = require('express').Router();

module.exports = (dataStorage, sendErrorPage, sendStatusPage) => {
	routes.get('/updateform', (req, res) =>
		res.render('form', {
			title: 'Update',
			header: 'Update person data',
			action: '/updatedata',
			personId: {value:'', readonly:''},
			firstname: {value:'', readonly:'readonly'},
			lastname: {value:'', readonly:'readonly'},
			department: {value:'', readonly:'readonly'},
			salary: {value:'', readonly:'readonly'}
		})
	);

	routes.post('/updatedata', async (req, res) => { //updatedata comes from the action
		try {
			let person = await dataStorage.get(req.body.personId);
			res.render('form', {
				title: 'Update',
				header: 'Update person data',
				action: '/updateperson',
				personId: {value:person.personId, readonly:'readonly'},
				firstname: {value:person.firstname, readonly:''},
				lastname: {value:person.lastname, readonly:''},
				department: {value:person.department, readonly:''},
				salary: {value:person.salary, readonly:''}
			});
		}
		catch(err){
			sendErrorPage(res, err.message);
		}
	});

	routes.post('/updateperson', (req, res) => { //post of the previous post
		if(!req.body) {
			res.sendStatus(500);
		}
		else {
			dataStorage.update(req.body)
				.then(message => sendStatusPage(res, message))
				.catch(err => sendErrorPage(res, err.message));
		}
	});

	return routes;
};
