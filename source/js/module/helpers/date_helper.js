/**
 * Created by Anatoly on 28.03.2016.
 */

const DateHelper = {

    //format date from UTC-string to 'dd/mm/yyyy'
    getDate: function (string) {
        return new Date(string).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\./g, '/');
    },

    getTime: function(string){
        const
            date = new Date(string),
            zeroFill = function(i) {
                return (i < 10 ? '0' : '') + i;
            };

        return zeroFill(date.getHours()) + ':' + zeroFill(date.getMinutes());
    }

};

module.exports = DateHelper;


