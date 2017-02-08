/**
 * Created by Anatoly on 11.08.2016.
 */
const   React 				= require('react'),
		Morearty			= require('morearty'),
		StudentListModel  	= require('./student-list-model'),
		Grid 				= require('module/ui/grid/grid');

const StudentList = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		//The function, which will call when user click on <Row> in Grid
		handleClick: React.PropTypes.func
	},
	componentWillMount: function () {
		this.model = new StudentListModel(this).init();
	},
	render: function () {
		return this.model.grid ? <Grid model={this.model.grid}/> : null;
	}
});

module.exports = StudentList;