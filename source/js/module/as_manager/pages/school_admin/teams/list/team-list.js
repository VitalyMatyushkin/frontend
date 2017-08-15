/**
 * Created by Anatoly on 22.08.2016.
 */
const   React 			= require('react'),
		Morearty		= require('morearty'),
		TeamListModel  	= require('./team-list-class'),
		Grid 			= require('module/ui/grid/grid'),
		Immutable		= require('immutable');

const TeamList = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		//The function, which will call when user click on <Row> in Grid
		handleClick: React.PropTypes.func
	},
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				grid 		= binding.toJS('grid');
		
		if (grid) {
			this.model = new TeamListModel(this).createGridFromExistingData(grid);
		} else {
			this.model = new TeamListModel(this).createGrid();
		}
	},
	render: function () {
		const binding = this.getDefaultBinding();
		
		binding.set('grid', Immutable.fromJS(this.model.grid));
		return this.model.grid ? <Grid model={this.model.grid} id="teams_table"/> : null;
	}
});

module.exports = TeamList;