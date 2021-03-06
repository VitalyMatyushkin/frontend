/**
 * Created by Anatoly on 13.09.2016.
 */

const 	React 					= require('react'),
		Morearty				= require('morearty'),
		RequestActionsClass 	= require('module/as_manager/pages/school_console/views/request-actions-class'),
		{Grid}					= require('module/ui/grid/grid'),
		{RegionHelper} 	    = require('module/helpers/region_helper'),
		Immutable				= require('immutable');

const SchoolRequest = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolInfo: React.PropTypes.object.isRequired
	},
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
		const   binding = this.getDefaultBinding(),
				region  = RegionHelper.getRegion(this.getMoreartyContext().getBinding());
		
		binding.set('grid', Immutable.fromJS(this.model.grid));
		return this.model.grid ? <Grid model={this.model.grid} region={region}/> : null;
	}
});

module.exports = SchoolRequest;