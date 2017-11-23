/**
 * Created by Anatoly on 16.08.2016.
 */
const   React 				= require('react'),
		Morearty			= require('morearty'),
		ClassListModel  	= require('./class-list-class'),
	{Grid}				= require('module/ui/grid/grid'),
		Immutable			= require('immutable');

const ClassList = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		//The function, which will call when user click on <Row> in Grid
		handleClick: React.PropTypes.func
	},
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				grid 		= binding.toJS('grid');
		
		if (grid) {
			this.model = new ClassListModel(this).createGridFromExistingData(grid);
		} else {
			this.model = new ClassListModel(this).createGrid();
		}
	},
	render: function () {
		const binding = this.getDefaultBinding();
		
		binding.set('grid', Immutable.fromJS(this.model.grid));
		return this.model.grid ? <Grid model={this.model.grid} id="school_form_table"/> : null;
	}
});

module.exports = ClassList;