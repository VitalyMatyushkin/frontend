/**
 * Created by wert on 07.11.16.
 */

import * as papa from 'papaparse';
import * as BPromise from 'bluebird';
import dateParser from './date_parser';

/** Tiny wrapper for Papa parse to return Promise.
 * Note, it is impossible to wrap it with Bluebird's converters as it use custom config.
 * @param file file to parse
 * @param config papa's config except `complete` and `error` props.
 */
const parseCSVFile = function(file, config) {
	return new BPromise((resolve, reject) => {
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
	house: 		['house'],
	phone1: 	['phone1'],
	phone2: 	['phone2'],
	phone3: 	['phone3']
};

/**
 * Guess actual column name based on guessTable.
 * @param {Array.<String>} fieldNames array of actual name of columns
 * @param {String} fieldToGuess name of column to search. This is key in guess table. Like `firstName`
 * @return {String|undefined} actual name for `fieldToGuess`
 */
const guessColumn = function(fieldNames: string[], fieldToGuess: string): string | undefined {
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
		house:		guessColumn(fieldNamesArray, 'house'),
		phone1: 	guessColumn(fieldNamesArray, 'phone1'),
		phone2: 	guessColumn(fieldNamesArray, 'phone2'),
		phone3: 	guessColumn(fieldNamesArray, 'phone3')
	}
};

/** Try to guess gender value */
const guessGender = function (genderValue: string): string {
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
		house: 		obj[headers.house],
		phone1: 	obj[headers.phone1],
		phone2: 	obj[headers.phone2],
		phone3: 	obj[headers.phone3]
	}
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

function pullFormsHousesPhones(result, school) {
	result.students = result.students.map( (student, i)=> {
		const	studentFormNoSpaces		= student.form ? student.form.replace(' ', '') : undefined,
			  	studentHouseNoSpaces	= student.house ? student.house.replace(' ', '') : undefined;

		const	form	= school.forms.find( form => form.name.replace(' ', '') === studentFormNoSpaces ),
				house	= school.houses.find( house => house.name.replace(' ', '') === studentHouseNoSpaces),
				formId	= form ? form.id : undefined,
				houseId = house ? house.id : undefined,
				phones	= [student.phone1, student.phone2, student.phone3].filter(p => p !== '' && typeof p !== 'undefined');

		student.formId = formId;
		student.houseId = houseId;

		if (typeof formId === 'undefined') result.errors.push( {
			type:		'StudentFormMissed',
			code:		'StudentFormMissed',
			message: 	`There is no form with name: ${student.form}. Student is: ${student.firstName} ${student.lastName}`,
			row:		i
		});

		student.nextOfKin = [];
		phones.forEach(phone => {
			if (!(/^((\+44|\+7|0)[\- ]?)?(\(?\d{3}\)?[\- ]?)?[\d\- ]{7,10}$/.test(phone))) {
				result.errors.push({
					type: 'InvalidPhone',
					code: 'InvalidPhone',
					message: `There is not valid phone: ${phone}. Student is: ${student.firstName} ${student.lastName}`,
					row: i
				});
			} else {
				student.nextOfKin.push({phone: phone});
			}
		});
		return student;
	});
	return result;
}

module.exports.pullFormsHousesPhones 	= pullFormsHousesPhones;
module.exports.loadFromCSV 				= readStudentsFromCSVFile;
module.exports.parseCSVFile 			= parseCSVFile;