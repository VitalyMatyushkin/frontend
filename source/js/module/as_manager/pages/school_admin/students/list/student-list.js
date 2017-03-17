/**
 * Created by Anatoly on 11.08.2016.
 */
const   React 				= require('react'),
		Morearty			= require('morearty'),
		StudentListClass  	= require('./student-list-class'),
		Grid 				= require('module/ui/grid/grid'),
		Immutable			= require('immutable');

const StudentList = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		//The function, which will call when user click on <Row> in Grid
		handleClick: React.PropTypes.func
	},
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				grid 		= binding.toJS('grid');
		this.model = new StudentListClass(this).init();
		/*if (typeof grid !== 'undefined') {
			this.model = new StudentListClass(this).loadFilter();
		} else {
			this.model = new StudentListClass(this).init();
		}*/
	},
	componentWillUnmount: function(){
		/*this.model = null;*/
	},
	render: function () {
		const binding = this.getDefaultBinding();
		
		if (typeof this.model.grid !== 'undefined') {
			binding.set('grid', Immutable.fromJS(this.model.grid));
		}
		return this.model.grid ? <Grid model={this.model.grid}/> : null;
	}
});

module.exports = StudentList;