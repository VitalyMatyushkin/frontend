/**
 * Created by Anatoly on 09.09.2016.
 */

const 	React 		= require('react'),
		Morearty 	= require('morearty'),
		Immutable 	= require('immutable'),
		Actions 	= require('./request-actions'),
		Grid 		= require('module/ui/grid/grid');

const PermissionRequestList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				grid 		= binding.toJS('gridRequest');

		if (grid) {
			this.model = new Actions(this).createGridFromExistingData(grid);
		} else {
			this.model = new Actions(this).createGrid();
		}
	},
	render: function () {
		const binding = this.getDefaultBinding();
		
		binding.set('gridRequest', Immutable.fromJS(this.model.grid));
		return this.model.grid ? <Grid model={this.model.grid}/> : null;
	}
});

module.exports = PermissionRequestList;