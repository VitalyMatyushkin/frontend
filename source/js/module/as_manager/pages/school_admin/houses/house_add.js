const 	HouseForm 	= require('module/as_manager/pages/school_admin/houses/house_form'),
		Morearty	= require('morearty'),
		React 		= require('react');

const HouseAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const	globalBinding	= this.getMoreartyContext().getBinding(),
				activeSchoolId	= globalBinding.get('userRules.activeSchoolId');

		this.activeSchoolId = activeSchoolId;
	},
	submitAdd: function(data) {
		data.schoolId = this.activeSchoolId;

		this.activeSchoolId && window.Server.schoolHouses.post(this.activeSchoolId, data).then(() => {
			document.location.hash = 'school_admin/houses';
		});
	},
	render: function() {
		return (
			<HouseForm
				title			= "Add new house..."
				onFormSubmit	= { this.submitAdd }
				binding			= { this.getDefaultBinding() }
			/>
		)
	}
});


module.exports = HouseAddPage;
