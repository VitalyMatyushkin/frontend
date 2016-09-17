/**
 * Created by Anatoly on 13.09.2016.
 */

const   React 		= require('react'),
		Morearty	= require('morearty'),
		Model 		= require('module/shared_pages/permission_requests/request-archive-model'),
		Grid 		= require('module/ui/grid/grid');

const SchoolRequestArchive = React.createClass({
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

module.exports = SchoolRequestArchive;