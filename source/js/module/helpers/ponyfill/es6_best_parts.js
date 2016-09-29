/**
 * Created by wert on 17.02.16.
 */

const 	objectAssign 			= require('./object_assign'),
		setMethodArrayFind 		= require('./array_find'),
		setMethodArrayFindIndex = require('./array_findIndex');

/* Some cool ES6 methods here which undoubtedly should be part of JS. */
const ES6_Best_Parts_Adder = function(){
    // will add Object.assign if there is no any
    if(!Object.assign) {
        console.info('Polyfilling Object.assign');
        Object.assign = objectAssign;
    }

	/** will add Array.prototype.find if there is no any */
	if (!Array.prototype.find) {
		console.info('Polyfilling Array.prototype.find');
		setMethodArrayFind();
	}

	/** will add Array.prototype.findIndex if there is no any */
	if (!Array.prototype.findIndex) {
		console.info('Polyfilling Array.prototype.findIndex');
		setMethodArrayFindIndex();
	}
};


module.exports = ES6_Best_Parts_Adder;