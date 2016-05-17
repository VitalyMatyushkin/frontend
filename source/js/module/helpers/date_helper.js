/**
 * Created by Anatoly on 28.03.2016.
 */

/** Some helpfull (??? I hope really helpfull) methods to deal with dates and time */
const DateHelper = {

    /** convert date from UTC-string to 'dd/mm/yyyy' format */
    getDate: function (string) {
        return new Date(string).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\./g, '/');
    },

    /** Extracts time from date string.
     * @param string {String} any date string which can be parsed by `new Date(...)` constructor
     * @returns {string} string in 'hh:mm' format
     */
    getTime: function(string){
        const   date        = new Date(string),
                zeroFill    = (i) => (i < 10 ? '0' : '') + i;

        return zeroFill(date.getHours()) + ':' + zeroFill(date.getMinutes());
    }

};

module.exports = DateHelper;


