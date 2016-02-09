const SportForm 	= require('module/as_admin/pages/admin_schools/sports/sports_form'),
      SportsHelpers = require('module/as_admin/pages/admin_schools/sports/sports_helpers'),
      React         = require('react'),
      Immutable 	= require('immutable');

let SportsAdd = React.createClass({
    mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding();

        binding.clear();
        binding.set(Immutable.fromJS(SportsHelpers.getEmptyFromData()));
    },
    onSubmit: function(data) {
        const self = this;

        window.Server.sports.post(SportsHelpers.convertFormDataToServerData(data)).then(function() {
            self.isMounted() && SportsHelpers.redirectToSportsPage();
        }).catch(function(err){
            console.log(err);
            self.isMounted() && SportsHelpers.redirectToSportsPage();
        });
    },
    render: function() {
        const self = this,
              binding = self.getDefaultBinding();

        return (
            <SportForm title="Add new sport" onFormSubmit={self.onSubmit} binding={binding} />
        )
    }
});

module.exports = SportsAdd;