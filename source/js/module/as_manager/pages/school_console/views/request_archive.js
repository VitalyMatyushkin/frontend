/**
 * Created by Anatoly on 13.09.2016.
 */

const 	React 				= require('react'),
		Morearty			= require('morearty'),
		RequestArchive 		= require('module/shared_pages/permission_requests/request-archive-class'),
		{Grid}				= require('module/ui/grid/grid'),
		{RegionHelper} 	    = require('module/helpers/region_helper'),
		Immutable			= require('immutable');

const SchoolRequestArchive = React.createClass({
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
		const   binding = this.getDefaultBinding(),
				region  = RegionHelper.getRegion(this.getMoreartyContext().getBinding());
		
		binding.set('grid', Immutable.fromJS(this.model.grid));
		return this.model.grid ? <Grid model={this.model.grid} region={region}/> : null;
	}
});

module.exports = SchoolRequestArchive;