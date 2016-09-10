/**
 * Created by Anatoly on 09.09.2016.
 */

const   React 		= require('react'),
		Morearty	= require('morearty'),
		Actions 	= require('./request-actions'),
		Grid 		= require('module/ui/grid/grid');

const PermissionRequestList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.actions = new Actions(this);
	},
	render: function () {
		return <Grid model={this.actions.grid}/>;
	}
});

module.exports = PermissionRequestList;