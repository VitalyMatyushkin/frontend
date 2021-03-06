/**
 * Created by Anatoly on 22.08.2016.
 */
const 	React 				= require('react'),
		Morearty			= require('morearty'),
		{TeamPlayersClass} 	= require('./team-players-model'),
		{Grid}				= require('module/ui/grid/grid'),
		Immutable			= require('immutable');

const TeamPlayers = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		//The function, which will call when user click on <Row> in Grid
		handleClick: React.PropTypes.func
	},
	componentWillMount: function () {
		this.model = new TeamPlayersClass(this).createGrid();
	},
	render: function () {
		const binding = this.getDefaultBinding();
		
		binding.set('grid', Immutable.fromJS(this.model.grid));
		return this.model.grid ? <Grid model={this.model.grid}/> : null;
	}
});

module.exports = TeamPlayers;