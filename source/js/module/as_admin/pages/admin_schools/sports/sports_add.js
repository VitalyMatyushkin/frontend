const   SportForm 		= require('module/as_admin/pages/admin_schools/sports/sports_form'),
		SportsHelpers 	= require('module/as_admin/pages/admin_schools/sports/sports_helpers'),
		Promise         = require('bluebird'),
		React         	= require('react'),
		Morearty		= require('morearty'),
		Immutable 		= require('immutable');

const SportsAdd = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding();

		binding.clear();
		binding.set(Immutable.fromJS(SportsHelpers.getEmptyFromData()));
	},
	onSubmit: function(data) {
		const self = this;

		const dataForServer = SportsHelpers.convertFormDataToServerData(data);

		if(!SportsHelpers.isCustomFieldsError(dataForServer)) {
			window.Server.sports.post(dataForServer).then(() => {
				self.isMounted() && SportsHelpers.redirectToSportsPage();
			}).catch(function(err){
				self.isMounted() && SportsHelpers.redirectToSportsPage();
			});
		}
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