/**
 * Created by Anatoly on 13.09.2016.
 */

const   React 		= require('react'),
		Morearty	= require('morearty'),
		Actions 	= require('module/as_manager/pages/school_console/views/request-actions'),
		Grid 		= require('module/ui/grid/grid');

const SchoolRequest = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.actions = new Actions(this);
		this.actions.init();
	},
	render: function () {
		return <Grid model={this.actions.grid}/>;
	}
});

module.exports = SchoolRequest;