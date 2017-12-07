const	Morearty	= require('morearty'),
		React		= require('react');

const	ClubForm	= require('module/as_manager/pages/clubs/clubs_form/clubs_form');

const	ClubsHelper	= require('module/as_manager/pages/clubs/clubs_helper');

const ClubAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	componentWillMount: function () {
		this.getDefaultBinding().sub('clubsForm').clear();
	},
	submitAdd: function(data) {
		const 	binding 		= this.getDefaultBinding(),
				formDataDays 	= typeof this.getDefaultBinding().toJS('clubsForm.days') !== 'undefined' ? this.getDefaultBinding().toJS('clubsForm.days') : [];
		//week days is required
		if (formDataDays.length === 0) {
			binding.set('clubsForm.isRequiredErrorDays', true);
		} else {
			ClubsHelper.convertClientToServerFormData(
				data,
				this.getDefaultBinding().toJS('clubsForm')
			);
			
			window.Server.schoolClubs.post(
				this.props.activeSchoolId,
				data
			).then(() => ClubsHelper.redirectToClubListPage());
		}
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<ClubForm
				title			= "Add new club..."
				activeSchoolId	= { this.props.activeSchoolId }
				onFormSubmit	= { this.submitAdd }
				binding			= { binding.sub('clubsForm') }
			/>
		)
	}
});

module.exports = ClubAddPage;