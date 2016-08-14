/**
 * Created by Anatoly on 11.08.2016.
 */
const   React 				= require('react'),
		Morearty			= require('morearty'),
		StudentListModel  	= require('./student-list-model'),
		Grid 				= require('module/ui/grid/grid');

const StudentList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.model = new StudentListModel(this);
	},
	render: function () {
		return (
			<Grid model={this.model.grid}/>
		);
	}
});

module.exports = StudentList;