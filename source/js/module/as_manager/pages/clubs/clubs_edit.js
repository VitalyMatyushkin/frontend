const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable');

const	ClubForm	= require('module/as_manager/pages/clubs/clubs_form');

const ClubEditPage = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	componentWillMount: function () {
		const 	binding			= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding(),
				routingData		= globalBinding.sub('routing.parameters').toJS(),
				clubId			= routingData.id;

		this.clubId = clubId;

		binding.clear();

		binding.set('isSync', false);
		if (typeof clubId !== 'undefined') {
			window.Server.schoolClub.get(
				{
					schoolId:	this.props.activeSchoolId,
					clubId:		clubId
				}
			).then(data => {
				binding.set('isSync',	true);
				binding.set('form',		Immutable.fromJS(data));
			});
		}
	},
	redirectToClubListPage: function () {
		document.location.hash = 'clubs/clubsList';
	},
	submitEdit: function(data) {
		window.Server.schoolClub.put(
			{
				schoolId:	this.props.activeSchoolId,
				clubId:		this.clubId
			},
			data
		).then(() => this.redirectToClubListPage());
	},
	render: function() {
		const binding = this.getDefaultBinding();

		if(binding.toJS('isSync')) {
			return (
				<ClubForm
					title			= "Edit club..."
					onFormSubmit	= { this.submitEdit }
					binding			= { binding }
				/>
			)
		} else {
			return null;
		}

	}
});

module.exports = ClubEditPage;