
const	React		= require('react'),
		Morearty	= require('morearty'),
		Immutable	= require('immutable'),
		Route		= require('module/core/route'),
		RouterView	= require('module/core/router');

const	ClubList	= require("module/as_manager/pages/clubs/club_list/club_list"),
		ClubAdd		= require("module/as_manager/pages/clubs/clubs_add"),
		ClubEdit	= require("module/as_manager/pages/clubs/clubs_edit");

const ClubsPage = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			clubList: {},
			clubsAdd: {
				clubsForm: {}
			},
			clubsEdit: {
				clubsEditRouting: {},
				subMenuItems: {},
				clubsMainInfoEdit: {
					clubsForm: {}
				},
				clubsChildrenEdit: {},
				activateClub: {}
			},
			clubsRouting: {}
		});
	},
	render: function() {
		const	binding			= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding();

		return (
			<RouterView
				routes	= { binding.sub('clubsRouting') }
				binding	= { globalBinding }
			>
				<Route
					path			= "/clubs/clubList"
					binding			= { binding.sub('clubList') }
					activeSchoolId	= { this.props.activeSchoolId }
					component		= { ClubList }
				/>

				<Route
					path			= "/clubs/add"
					binding			= { binding.sub('clubsAdd') }
					activeSchoolId	= { this.props.activeSchoolId }
					component		= { ClubAdd }
				/>

				<Route
					path			= "/clubs/editMainInfo /clubs/editChildren"
					binding			= { binding.sub('clubsEdit') }
					activeSchoolId	= { this.props.activeSchoolId }
					component		= { ClubEdit }
				/>
			</RouterView>
		)
	}
});


module.exports = ClubsPage;