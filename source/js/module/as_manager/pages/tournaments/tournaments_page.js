/**
 * Created by vitaly on 04.12.17.
 */
const	React		    = require('react'),
		Morearty	    = require('morearty'),
		{SVG}		    = require('module/ui/svg'),
		RouterView	    = require('module/core/router'),
		Route		    = require('module/core/route'),
		{RegionHelper} 	= require('module/helpers/region_helper');

const	{TournamentsList}	= require('module/as_manager/pages/tournaments/tournaments'),
		TournamentAdd		= require('module/as_manager/pages/tournaments/tournament_add'),
		TournamentEdit		= require('module/as_manager/pages/tournaments/tournament_edit');

const TournamentsPage = React.createClass({
	mixins: [Morearty.Mixin],
	//The function, which will call when user click on <Row> in Grid
	handleClick: function(place) {
		document.location.hash += `/edit?id=${place}`;
	},
	render: function() {
		const	binding 		= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding(),
				region          = RegionHelper.getRegion(globalBinding),
				addButton 		= <div className="addButtonShort" onClick={() => document.location.hash +='/add'}><SVG icon="icon_add_student" /></div>;
		
		
		return (
			<RouterView	routes	= { binding.sub('tournamentsRouting') }
						binding	= { globalBinding }
			>
				<Route
					path		= "/tournaments"
					binding		= { binding.sub('tournamentsList') }
					component	= { TournamentsList }
					handleClick	= { this.handleClick }
					addButton	= { addButton }
					region      = { region }
				/>
				<Route
					path		= "/tournaments/add"
					binding		= { binding.sub('tournamentFormWrapper') }
					component	= { TournamentAdd }
					region      = { region }
				/>
				<Route
					path		= "/tournaments/edit"
					binding		= { binding.sub('tournamentFormWrapper') }
					component	= { TournamentEdit }
					region      = { region }
				/>
			</RouterView>
		)
	}
});

module.exports = TournamentsPage;