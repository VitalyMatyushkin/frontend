/**
 * Created by wert on 17.02.16.
 */

const objectAssign = require('./object_assign');

/* Some cool ES6 methods here which undoubtedly should be part of JS. */
const ES6_Best_Parts_Adder = function(){
    // will add Object.assign if there is no any
    if(!Object.assign) {
        console.info('Polyfilling Object.assign');
        Object.assign = objectAssign;
    }
};


module.exports = ES6_Best_Parts_Adder;