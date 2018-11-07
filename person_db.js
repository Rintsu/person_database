'use strict';

const Database = require('./database');
const sqlStatements = require('./sql_statements');
const options = require('./options');

const allSql = sqlStatements.getAllSql.join(' ');//space going between the sql clauses in sql_statements.json - IMPORTANT
const getPersonSql = sqlStatements.getPersonSql.join(' ');
const insertSql = sqlStatements.insertPersonSql.join(' ');
const deleteSql = sqlStatements.deletePersonSql.join(' ');
const updateSql = sqlStatements.updatePersonSql.join(' ');

class PersonDatabase {
	constructor(options, debug = false){
		this.personDb = new Database(options, debug);
	}
	getAll(){ //method
		return new Promise(async (resolve, reject) => { //await can only be used within async function
			try{
				let result = await this.personDb.doQuery(allSql);
				resolve(result);
			}
			catch(err){
				reject(fatalError(err));
			}
		});
	}
	get(personId){
		return new Promise(async (resolve, reject) => {
			try{
				let result = await this.personDb.doQuery(getPersonSql, +personId);// + means number here
				if(result.length === 0) {
					reject(new Error('Person unknown'));
				}
				else {
					resolve(result[0]);
				}
			}
			catch(err){
				reject(fatalError(err));
			}
		});
	}
	insert(person){
		return new Promise(async (resolve, reject) => {
			try{
				let result = await this.personDb.doQuery(insertSql,
					+person.personId,
					person.firstname,
					person.lastname,
					person.department,
					+person.salary
				);
				if(result.affectedRows === 0) {
					reject(new Error('No person was added'));
				}
				else {
					resolve(`Person with ID ${person.personId} was added`);
				}
			}
			catch(err){
				reject(fatalError(err));
			}
		});
	}

	delete(personId){
		return new Promise(async (resolve, reject) => {
			try {
				let result = await this.personDb.doQuery(deleteSql, +personId);
				if(result.affectedRows === 0){
					reject(new Error(`No person with given ID ${personId} was found. Nothing deleted.`));
				}
				else {
					resolve(`Person with ID ${personId} was deleted.`);
				}
			}
			catch(err) {
				reject(fatalError(err));
			}
		});
	}

	update(person){
		return new Promise(async (resolve, reject) => {
			try{
				let result = await this.personDb.doQuery(updateSql, person.firstname, person.lastname, person.department, +person.salary, +person.personId);
				if(result.affectedRows === 0){
					reject(new Error('No data was updated.'));
				}
				else {
					resolve(`Person with ID ${person.personId} was updated.`);
				}
			}
			catch(err){
				reject(fatalError(err));
			}
		});
	}
} //end of class

module.exports = function initDataStorage(debug = false){
	return new PersonDatabase(options, debug);
};

function fatalError(err){
	return new Error(`Sorry! Error in our application. ${err.message}`);
}
