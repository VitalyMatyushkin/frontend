const	React		= require('react'),
		Morearty	= require('morearty'),
		Model		= require('module/as_admin/pages/admin_schools/admin_views/admin-list-model'),
		Grid		= require('module/ui/grid/grid');


const SchoolsList = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		//The function, which will call when user click on <Row> in Grid
		handleClick: React.PropTypes.func
	},
	componentWillMount: function () {
		this.model = new Model(this);
	},
	render: function () {
		return (
			<Grid model={this.model.grid}/>
		);
	}
});


module.exports = SchoolsList;