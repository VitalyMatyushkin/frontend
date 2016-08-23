/**
 * Created by Anatoly on 22.08.2016.
 */
const   React 			= require('react'),
		Morearty		= require('morearty'),
		TeamListModel  	= require('./team-list-model'),
		Grid 			= require('module/ui/grid/grid');

const TeamList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.model = new TeamListModel(this);
	},
	render: function () {
		return (
			<Grid model={this.model.grid}/>
		);
	}
});

module.exports = TeamList;