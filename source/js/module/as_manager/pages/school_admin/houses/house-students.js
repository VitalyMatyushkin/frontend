/**
 * Created by Anatoly on 22.08.2016.
 */
const   React 				= require('react'),
		Morearty			= require('morearty'),
		StudentListModel  	= require('module/as_manager/pages/school_admin/students/list/student-list-model'),
		Grid 				= require('module/ui/grid/grid');

const HouseStudents = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	rootBinding = this.getMoreartyContext().getBinding(),
				id 			= rootBinding.get('routing.parameters.id'),
				name 		= rootBinding.get('routing.parameters.name');

		this.model = new StudentListModel(this);
		this.model.title = `Students of ${name} house`;
		this.model.filters = {where:{houseId:id}};
		this.model.columns.splice(5, 2);
		this.model.btnAdd = null;
		this.model.init();
	},
	render: function () {
		return (
			<Grid model={this.model.grid}/>
		);
	}
});

module.exports = HouseStudents;