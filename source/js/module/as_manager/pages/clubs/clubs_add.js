const	Morearty	= require('morearty'),
		React		= require('react');

const	ClubForm	= require('module/as_manager/pages/clubs/clubs_form');

const ClubAddPage = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	redirectToClubListPage: function () {
		document.location.hash = 'clubs/clubsList';
	},
	submitAdd: function(data) {
		window.Server.schoolClubs.post(
			this.props.activeSchoolId,
			data
		).then(() => this.redirectToClubListPage());
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<ClubForm
				title			= "Add new club..."
				onFormSubmit	= { this.submitAdd }
				binding			= { binding }
			/>
		)
	}
});

module.exports = ClubAddPage;