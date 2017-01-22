const	React		= require('react'),
		Morearty	= require('morearty'),
		Actions		= require('../../../school_console/views/request-actions'),
		Grid		= require('../../../../../ui/grid/grid');

const UserRequestList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.actions = new Actions(this);
		this.actions.init();
	},
	render: function () {
		return <Grid model={this.actions.grid}/>;
	}
});

module.exports = UserRequestList;