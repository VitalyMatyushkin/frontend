/**
 * Created by Anatoly on 11.08.2016.
 */
const   React 			= require('react'),
		Morearty		= require('morearty'),
		TeamListModel  	= require('./team-list-model'),
		Grid 			= require('module/ui/grid/grid');

const TeamList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const   self          = this,
				binding       = self.getDefaultBinding();

		window.Server.sports.get().then(sports => binding.set('sports', sports));

		this.model = new TeamListModel(this);
	},
	render: function () {
		return (
			<Grid model={this.model.grid}/>
		);
	}
});

module.exports = TeamList;