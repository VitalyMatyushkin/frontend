/**
 * Created by wert on 07.11.16.
 */

'use strict';

const 	papa		= require('papaparse'),
		Promise		= require('bluebird'),
		Lazy		= require('lazy.js'),
    	dateParser	= require('./date_parser');

/** Tiny wrapper for Papa parse to return Promise.
 * Note, it is impossible to wrap it with Bluebird's converters as it use custom config.
 * @param file file to parse
 * @param config papa's config except `complete` and `error` props.
 */
const parseCSVFile = function(file, config) {
	return new Promise((resolve, reject) => {
		const effectiveConfig = Object.assign({}, config, {
			complete:	(results, file) => { resolve(results) },
			error: 		(error, file) => { reject(error) }
		});
		papa.parse(file, effectiveConfig);
		// no return
	});
};

/** possible values for well-known params */
const guessTable = {
	firstName:	['name', 'firstname'],
	lastName:	['surname', 'lastname'],
	gender: 	['gender'],
	birthday: 	['birthday', 'bday', 'dob', 'date of birth'],
	form: 		['form'],
	house: 		['house']
};

/**
 * Guess actual column name based on guessTable.
 * @param {Array.<String>} fieldNames array of actual name of columns
 * @param {String} fieldToGuess name of column to search. This is key in guess table. Like `firstName`
 * @return {String|undefined} actual name for `fieldToGuess`
 */
const guessColumn = function(fieldNames, fieldToGuess) {
	const possibleValues = guessTable[fieldToGuess];
	if(!Array.isArray(possibleValues)) return undefined;	// there is no such value in table
	return fieldNames.find( fieldName => {
		const lowFieldName = fieldName.toLowerCase();
		return possibleValues.findIndex( possibleValue => possibleValue === lowFieldName ) !== -1;
	});
};

/**
 * Return mapping object. Each key have real column name or undefined if no suitable column found
 * @param {Array.<String>} fieldNamesArray fieldNames array of actual name of columns
 * @return {{firstName: (String|undefined), lastName: (String|undefined), gender: (String|undefined), birthday: (String|undefined), form: (String|undefined), house: (String|undefined)}}
 */
const guessHeaders = function(fieldNamesArray) {
	return {
		firstName:	guessColumn(fieldNamesArray, 'firstName'),
		lastName:	guessColumn(fieldNamesArray, 'lastName'),
		gender:		guessColumn(fieldNamesArray, 'gender'),
		birthday:	guessColumn(fieldNamesArray, 'birthday'),
		form:		guessColumn(fieldNamesArray, 'form'),
		house:		guessColumn(fieldNamesArray, 'house')
	}
};

/** Try to guess gender value */
const guessGender = function (genderValue) {
	const lowGender = genderValue.toLowerCase();
	if(lowGender === 'boy' || lowGender === 'male' || lowGender === '1') 	return 'MALE';
	if(lowGender === 'girl' || lowGender === 'female' || lowGender === '0') return 'FEMALE';
	return genderValue;
};


const objectToStudent = function(headers, obj) {
	const 	firstName	= obj[headers.firstName],
			lastName	= obj[headers.lastName],
			gender		= obj[headers.gender],
    		birthday    = obj[headers.birthday];

	return {
		firstName:	firstName ? firstName.trim() : undefined,
		lastName:	lastName ? lastName.trim() : undefined,
		gender: 	gender ? guessGender(gender) : undefined,
		birthday:	birthday ? dateParser(birthday) : undefined,
		form:		obj[headers.form],
		house: 		obj[headers.house]
	};
};

function readStudentsFromCSVFile(file) {
	return parseCSVFile(file, { header: true, skipEmptyLines: true }).then( result => {
		const 	data			= result.data || [],
				origHeaders		= result.meta.fields || [],
				guessedHeaders	= guessHeaders(origHeaders);

		const studentArray = data
			.filter( item => Object.keys(item).length > 1 )	// removing empty objects
			.map( item => objectToStudent(guessedHeaders, item));
		return {
			students: studentArray,
			errors: result.errors,
			meta: result.meta
		}
	});
}

function pullFormsAndHouses(result, school) {
	result.students = result.students.map( (student, i)=> {
		const	studentFormNoSpaces		= student.form ? student.form.replace(' ', '') : undefined,
			  	studentHouseNoSpaces	= student.house ? student.house.replace(' ', '') : undefined;

		const	form	= school.forms.find( form => form.name.replace(' ', '') === studentFormNoSpaces ),
				house	= school.houses.find( house => house.name.replace(' ', '') === studentHouseNoSpaces),
				formId	= form ? form.id : undefined,
				houseId = house ? house.id : undefined;

		student.formId = formId;
		student.houseId = houseId;
		if (typeof formId === 'undefined') result.errors.push( {
			type:		'StudentFormMissed',
			code:		'StudentFormMissed',
			message: 	`There is no form with name: ${student.form}. Student is: ${student.firstName} ${student.lastName}`,
			row:		i
		});
		return student;
	});
	return result;
}

module.exports.pullFormsAndHouses 		= pullFormsAndHouses;
module.exports.loadFromCSV 				= readStudentsFromCSVFile;
module.exports.parseCSVFile 			= parseCSVFile;