var HouseForm = require('module/as_manager/pages/school_admin/houses/house_form'),
	React = require('react'),
	HouseAddPage;

HouseAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		var self = this,
			globalBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = globalBinding.get('userRules.activeSchoolId');

		self.activeSchoolId = activeSchoolId;
	},
	submitAdd: function(data) {
		var self = this;

		//data.schoolId = self.activeSchoolId;
        //
		//self.activeSchoolId && window.Server.houses.post(self.activeSchoolId, data).then(function() {
		//	document.location.hash = 'school_admin/houses';
		//});
		window.Server.getAllHouses.post(data)
			.then(function(){document.location.hash='/admin_schools/admin_views/houses';})
			.catch(function(err){alert(err.errorThrown);document.location.hash='/admin_schools/admin_views/houses';});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<HouseForm title="Add new house..." onFormSubmit={self.submitAdd} binding={binding} />
		)
	}
});


module.exports = HouseAddPage;
