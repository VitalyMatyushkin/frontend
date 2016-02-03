var HouseForm = require('module/as_admin/pages/admin_schools/houses/house_form'),
	React = require('react'),
	HouseAddPage;

HouseAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		//self.activeSchoolId = activeSchoolId;
	},
	submitAdd: function(data) {
		var self = this;
		window.Server.houses.post(data.schoolId, data).then(function() {
			document.location.hash = '/admin_schools/admin_views/houses';
		}).catch(function(er){
			alert(er.errorThrown+' Server Error');
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<HouseForm title="Add new house to school" onFormSubmit={self.submitAdd} binding={binding} />
		)
	}
});


module.exports = HouseAddPage;
