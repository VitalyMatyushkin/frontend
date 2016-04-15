
const 	HouseForm 		= 	require('module/as_admin/pages/admin_schools/school_sandbox/houses/house_form'),
		React 			= 	require('react');

const HouseAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
        const   self        = this,
            binding 	= self.getDefaultBinding(),
            schoolId    = binding.get('routing.pathParameters.0');

        self.schoolId = schoolId;
        self.HOUSE_URL = `school_sandbox/${schoolId}/houses`;
	},
	submitAdd: function(data) {
		var self = this;
		window.Server.houses.post(self.schoolId, data).then(function() {
			document.location.hash = self.HOUSE_URL;
		}).catch(function(er){
			document.location.hash = self.HOUSE_URL;
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();
		return (
			<HouseForm title="Add new house to school" onFormSubmit={self.submitAdd} binding={binding.sub('houseAdd')} />
		)
	}
});


module.exports = HouseAddPage;
