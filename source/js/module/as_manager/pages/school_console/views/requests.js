/**
 * Created by Anatoly on 13.09.2016.
 */

const   React 		= require('react'),
		Morearty	= require('morearty'),
		Actions 	= require('module/shared_pages/permission_requests/request-actions'),
		Grid 		= require('module/ui/grid/grid');

const SchoolRequest = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.actions = new Actions(this);
		this.actions.columns.splice(0,3);
		this.actions.init();
	},
	render: function () {
		return <Grid model={this.actions.grid}/>;
	}
});

module.exports = SchoolRequest;