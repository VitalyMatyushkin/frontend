/**
 * Created by Anatoly on 22.08.2016.
 */
const   React 				= require('react'),
		Morearty			= require('morearty'),
		StudentListClass  	= require('module/as_manager/pages/school_admin/students/list/student-list-class'),
	{Grid}				= require('module/ui/grid/grid');

const HouseStudents = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		//The function, which will call when user click on <Row> in Grid
		handleClick: React.PropTypes.func
	},
	componentWillMount: function () {
		const 	rootBinding = this.getMoreartyContext().getBinding(),
				id 			= rootBinding.get('routing.parameters.id'),
				name 		= rootBinding.get('routing.parameters.name');

		this.model = new StudentListClass(this);
		this.model.title = `Students of ${name} house`;
		this.model.filters = {where:{houseId:id}};
		this.model.columns.splice(5, 2);
		this.model.btnAdd = null;
		this.model.createGrid();
	},
	render: function () {
		return this.model.grid ? <Grid model={this.model.grid}/> : null;
	}
});

module.exports = HouseStudents;