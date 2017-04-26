/**
 * Created by Anatoly on 13.09.2016.
 */

const   React 				= require('react'),
		Morearty			= require('morearty'),
		RequestArchive 		= require('./request-archive-class'),
		Grid 				= require('module/ui/grid/grid'),
		Immutable			= require('immutable');

const PermissionRequestArchive = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				grid 		= binding.toJS('grid');
		
		if (grid) {
			this.model = new RequestArchive(this).createGridFromExistingData(grid);
		} else {
			this.model = new RequestArchive(this).createGrid();
		}
	},
	render: function () {
		const binding = this.getDefaultBinding();
		
		binding.set('grid', Immutable.fromJS(this.model.grid));
		return this.model.grid ? <Grid model={this.model.grid}/> : null;
	}
});

module.exports = PermissionRequestArchive;