'use strict';

const http = require('http');
const path = require('path');
const express = require('express');

const app = express();
const {host, port, debug} = require('./server_config');

const server = http.createServer(app);

//this will require the initDataStorage function and call it from person_db
//with debug parameter value from server_config.json
const personStorage = require('./person_db')(debug);

const statusHandling = [sendErrorPage, sendStatusPage];

const getroutes = require('./routes/getroutes')(personStorage, ...statusHandling);
const insertroutes = require('./routes/insertroutes')(personStorage, ...statusHandling);

app.use(express.urlencoded({extended:false})); //parsing the form data, has to be before other .uses

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pageviews'));

app.use(express.static(path.join(__dirname, 'public')));
app.use('/', getroutes);
app.use('/', insertroutes);
app.get('/', (req, res) => res.sendFile(path.join(__dirname, 'menu.html')));

server.listen(port, host, () => {
	/*eslint-disable no-console*/
	console.log(`Server ${host} running at port ${port}`);
});

function sendErrorPage(res, message='Error', title='Error', header='Error'){
	sendStatusPage(res, message, title, header);
}

function sendStatusPage(res, message='Status', title='Status', header='Status'){
	return res.render('status_page', {message:message, title:title, header:header});
}
