/**
 * Created by Anatoly on 13.09.2016.
 */

const   React 		= require('react'),
		Morearty	= require('morearty'),
		Model 		= require('./request-archive-model'),
		Grid 		= require('module/ui/grid/grid');

const PermissionRequestArchive = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.model = new Model(this).init();
	},
	render: function () {
		return <Grid model={this.model.grid}/>;
	}
});

module.exports = PermissionRequestArchive;