const	React				= require('react'),
		Morearty			= require('morearty'),
		RequestArchive		= require('../../../../../shared_pages/permission_requests/request-archive-class'),
		Grid				= require('../../../../../ui/grid/grid'),
		Immutable			= require('immutable');

const UserRequestListArchive = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				grid 		= binding.toJS('grid');
		
		if (grid) {
			this.model = new RequestArchive(this).createGridFromExistingData(grid);
		} else {
			this.model = new RequestArchive(this);
			this.model.columns.splice(5, 2);
			this.model.createGrid();
		}
	},
	render: function () {
		const binding = this.getDefaultBinding();
		
		binding.set('grid', Immutable.fromJS(this.model.grid));
		return this.model.grid ? <Grid model={this.model.grid}/> : null;
	}
});

module.exports = UserRequestListArchive;