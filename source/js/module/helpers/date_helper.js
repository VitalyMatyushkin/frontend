/**
 * Created by Anatoly on 28.03.2016.
 */

const DateHelper = {

    //format date from UTC-string to 'dd/mm/yyyy'
    format: function (string) {
        return new Date(string).toLocaleDateString('en-GB', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }).replace(/\./g, '/');
    },

    getTime: function(string){
        return new Date(string).getTime();
    }

};

module.exports = DateHelper;


