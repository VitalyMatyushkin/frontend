const 	HouseForm 	= require('module/as_admin/pages/admin_schools/school_sandbox/houses/house_form'),
		React 		= require('react');

const HouseAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const self 			= this,
			globalBinding 	= self.getMoreartyContext().getBinding();
		self.activeSchoolId = globalBinding.get('userRules.activeSchoolId');
	},
	submitAdd: function(data) {
		var self = this;
		window.Server.houses.post(self.activeSchoolId, data).then(function() {
			document.location.hash = '/school_sandbox/houses';
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
