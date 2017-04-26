const	React 					= require('react'),
		Morearty 				= require('morearty'),
		RequestActionsClass 	= require('../../../school_console/views/request-actions-class'),
		Grid 					= require('../../../../../ui/grid/grid'),
		Immutable 				= require('immutable');

const UserRequestList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				grid 		= binding.toJS('grid');
		
		if (grid) {
			this.model = new RequestActionsClass(this).createGridFromExistingData(grid);
		} else {
			this.model = new RequestActionsClass(this).createGrid();
		}
	},
	render: function () {
		const binding = this.getDefaultBinding();
		
		binding.set('grid', Immutable.fromJS(this.model.grid));
		return this.model.grid ? <Grid model={this.model.grid}/> : null;
	}
});

module.exports = UserRequestList;