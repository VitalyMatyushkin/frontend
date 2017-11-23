const	React			= require('react'),
		Morearty		= require('morearty'),
	{Grid}		= require('module/ui/grid/grid'),
		PlaceListModel	= require('./place_list_class'),
		Immutable		= require('immutable');

const PlaceList = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		//The function, which will call when user click on <Row> in Grid
		handleClick: React.PropTypes.func
	},
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				grid 		= binding.toJS('grid');
		
		if (grid) {
			this.model = new PlaceListModel(this).createGridFromExistingData(grid);
		} else {
			this.model = new PlaceListModel(this).createGrid();
		}
	},
	render: function() {
		const binding = this.getDefaultBinding();
		
		binding.set('grid', Immutable.fromJS(this.model.grid));
		return this.model.grid ? <Grid model={this.model.grid}/> : null;
	}
});

module.exports = PlaceList;