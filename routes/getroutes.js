'use strict';

const routes = require('express').Router();

const initRoutes = function(storage, sendErrorPage){
	let dataStorage = storage;

	routes.get('/all', (req, res) => {
		dataStorage.getAll()
			.then(result => res.render('all_persons', {result:result}))
			.catch(err => sendErrorPage(res, err.message));
	});

	routes.get('/getperson', (req, res) => //one-liner does not need curly braces
		res.render('get_person', {title:'Get', header:'Get person by ID', action:'/getperson'})
	);

	routes.post('/getperson', (req, res) => {
		if(!req.body) {
			res.sendStatus(401);
		}
		else {
			let personId = req.body.personId;
			dataStorage.get(personId) //get() comes from person_db
				.then(person => res.render('person_page', {person}))
				.catch(err => sendErrorPage(res, err.message, 'Oops!', 'Person Error'));//pagetitle and header from the sendErrorPage from index.js
		}
	});

	return routes;
};

module.exports = initRoutes;
