const	SportForm		= require('module/as_admin/pages/admin_schools/sports/sports_form'),
		SportsHelpers	= require('module/as_admin/pages/admin_schools/sports/sports_helpers'),
		React 			= require('react'),
		Promise			= require('bluebird'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable');


const SportEdit = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const	self 			= this,
				binding 		= self.getDefaultBinding(),
				globalBinding 	= self.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				sportId 		= routingData.id;

		binding.clear();
		if (sportId) {
			window.Server.sport.get(sportId).then(function (data) {
				if(self.isMounted()) {
					binding.set(Immutable.fromJS(SportsHelpers.convertServerDataToFormData(data)));
				}
			});

			self.sportId = sportId;
		}
	},
	submitEdit: function(data) {
		const self = this;

		const dataForData = SportsHelpers.convertFormDataToServerData(data);

		if(!SportsHelpers.isCustomFieldsError(dataForData)) {
			window.Server.sport.put(self.sportId, SportsHelpers.convertFormDataToServerData(data)).then(() => {
				self.isMounted() && SportsHelpers.redirectToSportsPage();
			}).catch(function(err){
				self.isMounted() && SportsHelpers.redirectToSportsPage();
			});
		}
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<SportForm title="Edit sport" onFormSubmit={self.submitEdit} binding={binding} />
		)
	}
});

module.exports = SportEdit;