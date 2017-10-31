const	React			= require('react'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty');

const	Grid			= require('module/ui/grid/grid'),
		AppListClass	= require('module/as_admin/pages/apps/app_list_model');

const AppList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const	binding	= this.getDefaultBinding(),
				grid	= binding.toJS('grid');

		if (grid) {
			this.model = new AppListClass(this).createGridFromExistingData(grid);
		} else {
			this.model = new AppListClass(this).createGrid();
		}
	},
	render: function () {
		const binding = this.getDefaultBinding();

		binding.set(
			'grid',
			Immutable.fromJS(this.model.grid)
		);

		return (
			<div className="bSchoolMaster">
				{
					this.model.grid ?
						<Grid
							id		= "clubs_table"
							model	= { this.model.grid }
						/>:
						null
				}
			</div>
		);
	}
});

module.exports = AppList;