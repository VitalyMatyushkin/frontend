/**
 * Created by Anatoly on 22.08.2016.
 */
const   React 				= require('react'),
		Morearty			= require('morearty'),
		TeamPlayersModel  	= require('./team-players-model'),
		Grid 				= require('module/ui/grid/grid');

const TeamPlayers = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.model = new TeamPlayersModel(this);
	},
	render: function () {
		return this.model.grid ? <Grid model={this.model.grid}/> : null;
	}
});

module.exports = TeamPlayers;