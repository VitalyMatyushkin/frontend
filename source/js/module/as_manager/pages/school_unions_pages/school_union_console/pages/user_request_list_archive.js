const	React		= require('react'),
		Morearty	= require('morearty'),
		Model		= require('../../../../../shared_pages/permission_requests/request-archive-model'),
		Grid		= require('../../../../../ui/grid/grid');

const UserRequestListArchive = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.model = new Model(this);
		this.model.columns.splice(5,2);
		this.model.init();
	},
	render: function () {
		return <Grid model={this.model.grid}/>;
	}
});

module.exports = UserRequestListArchive;