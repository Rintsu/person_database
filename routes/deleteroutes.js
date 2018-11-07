'use strict';

const routes = require('express').Router();

module.exports = (dataStorage, sendErrorPage, sendStatusPage) => {
	routes.get('/deleteperson', (req, res) =>
		res.render('get_person', {title:'Remove', header:'Remove person', action:'/deleteperson'})
	);

	routes.post('/deleteperson', (req, res) => {
		if(!req.body || !req.body.personId){
			res.sendStatusPage(500);
		}
		else {
			dataStorage.delete(req.body.personId)
				.then(message => sendStatusPage(res, message))
				.catch(err => sendErrorPage(res, err.message));
		}
	});
	return routes;
};
