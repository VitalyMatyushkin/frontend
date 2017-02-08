const 	RouterView 				= require('module/core/router'),
		React 					= require('react'),
		Morearty				= require('morearty'),
		Route 					= require('module/core/route'),
		TeamsListComponent 		= require("module/as_manager/pages/school_admin/teams/list/team-list"),
		TeamsAddComponent 		= require("module/as_manager/pages/school_admin/teams/team_add"),
		TeamsEditComponent 		= require("module/as_manager/pages/school_admin/teams/team_edit"),
		TeamPlayersComponent 	= require("module/as_manager/pages/school_admin/teams/players/team-players");



const TeamsPage = React.createClass({
	mixins: [Morearty.Mixin],
	//The function, which will call when user click on <Row> with Teams in Grid
	handleClickTeam: function(teamId, teamName) {
		document.location.hash = 'school_admin/teams/players?id=' + teamId + '&name=' + teamName;
	},
	//The function, which will call when user click on <Row> with list of student in Grid
	handleClickStudent: function(studentId) {
		document.location.hash = 'school_admin/students/stats?id=' + studentId;
	},
	render: function() {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding();

		return (
			<RouterView routes={binding.sub('teamsRouting')} binding={globalBinding}>
				<Route
					path			= "/school_admin/teams"
					binding			= { binding.sub('teamsList') }
					formBinding		= { binding.sub('teamForm') }
					component		= { TeamsListComponent }
					handleClick		= { this.handleClickTeam }
				/>

				<Route
					path			= "/school_admin/teams/add"
					binding			= { binding.sub('teamAdd') }
					component		= { TeamsAddComponent }
				/>

				<Route
					path			= "/school_admin/teams/edit"
					binding			= { binding.sub('teamEdit') }
					component		= { TeamsEditComponent }
				/>

				<Route
					path			= "/school_admin/teams/players"
					binding			= { binding.sub('teamPlayers') }
					component		= { TeamPlayersComponent }
					handleClick		= { this.handleClickStudent }
				/>
			</RouterView>
		);
	}
});

module.exports = TeamsPage;