const	React			= require('react'),
		Immutable		= require('immutable'),
		Morearty		= require('morearty');

const{Grid}		= require('module/ui/grid/grid'),
		ClubListClass	= require('module/as_manager/pages/clubs/club_list/club_list_model');

const ClubList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const	binding	= this.getDefaultBinding(),
				grid	= binding.toJS('grid');

		if (grid) {
			this.model = new ClubListClass(this).createGridFromExistingData(grid);
		} else {
			this.model = new ClubListClass(this).createGrid();
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
						<Grid model={this.model.grid} id="clubs_table"/>:
						null
				}
			</div>
		);
	}
});

module.exports = ClubList;