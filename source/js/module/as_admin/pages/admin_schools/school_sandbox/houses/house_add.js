const 	HouseForm 		= 	require('module/as_admin/pages/admin_schools/school_sandbox/houses/house_form'),
		React 			= 	require('react'),
		MoreartyHelper	=	require('module/helpers/morearty_helper');
		

const HouseAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	HOUSE_URL:'school_sandbox/houses',
	componentWillMount: function () {
		const self 			= 	this;
		self.activeSchoolId = 	MoreartyHelper.getActiveSchoolId(self);
	},
	submitAdd: function(data) {
		var self = this;
		window.Server.houses.post(self.activeSchoolId, data).then(function() {
			document.location.hash = self.HOUSE_URL;
		}).catch(function(er){
			document.location.hash = self.HOUSE_URL;
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
