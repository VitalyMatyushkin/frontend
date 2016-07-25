/**
 * Created by Anatoly on 25.07.2016.
 */

const   React 		= require('react'),
		Morearty	= require('morearty'),
		Actions 	= require('module/ui/grid/test-pages/users-actions'),
		Grid 		= require('module/ui/grid/grid');

const Users = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
		this.actions = new Actions(this);
	},
	render: function() {
		return <Grid model={this.actions.grid} />;
	}
});

module.exports = Users;