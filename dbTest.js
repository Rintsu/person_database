'use strict';

const Database = require('./database');
const sqlStatements = require('./sql_statements');

const personDb = new Database({
	host:'localhost',
	port:3306,
	user:'saku',
	password:'secret',
	database:'persondatabase'
}, true);

const allSql = sqlStatements.getAllSql.join(' ');

personDb.doQuery(allSql)
/*eslint-disable no-console*/
	.then(result => console.log(result))
	.catch(err => console.log(err.message));
