/**
 * Created by vitaly on 04.12.17.
 */
const	React		= require('react'),
		Morearty	= require('morearty'),
		{SVG}		= require('module/ui/svg'),
		RouterView	= require('module/core/router'),
		Route		= require('module/core/route');

const	{TournamentsList}	= require('module/as_manager/pages/school_unions_pages/school_union_console/pages/tournaments/tournaments'),
		TournamentAdd		= require('module/as_manager/pages/school_unions_pages/school_union_console/pages/tournaments/tournament_add'),
		TournamentEdit		= require('module/as_manager/pages/school_unions_pages/school_union_console/pages/tournaments/tournament_edit');

const TournamentsPage = React.createClass({
	mixins: [Morearty.Mixin],
	//The function, which will call when user click on <Row> in Grid
	handleClick: function(place) {
		document.location.hash += `/edit?id=${place}`;
	},
	render: function() {
		const	binding 		= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding(),
				addButton 		= <div className="addButtonShort" onClick={() => document.location.hash +='/add'}><SVG icon="icon_add_student" /></div>;
		
		
		return (
			<RouterView	routes	= { binding.sub('placesRouting') }
						binding	= { globalBinding }
			>
				<Route
					path		= "/school_union_console/tournaments"
					binding		= { binding.sub('tournamentsList') }
					component	= { TournamentsList }
					handleClick	= { this.handleClick }
					addButton	= { addButton }
				/>
				<Route
					path		= "/school_union_console/tournaments/add"
					binding		= { binding.sub('tournamentFormWrapper') }
					component	= { TournamentAdd }
				/>
				<Route
					path		= "/school_union_console/tournaments/edit"
					binding		= { binding.sub('tournamentFormWrapper') }
					component	= { TournamentEdit }
				/>
			</RouterView>
		)
	}
});

module.exports = TournamentsPage;