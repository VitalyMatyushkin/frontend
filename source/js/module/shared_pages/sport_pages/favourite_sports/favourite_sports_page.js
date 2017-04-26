const	React			= require('react'),
		Morearty		= require('morearty'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		Grid			= require('module/ui/grid/grid'),
		SportListModel	= require('module/shared_pages/sport_pages/sport_list_model'),
		Immutable		= require('immutable');

const SportsPage = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes:{
		onReload: React.PropTypes.func.isRequired
	},
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				grid 		= binding.toJS('grid');
		
		if (grid) {
			this.model = new SportListModel(
				this,
				MoreartyHelper.getActiveSchoolId(this),
				this.props.onReload
			).createGridFromExistingData(
				grid
			);
		} else {
			this.model = new SportListModel(
				this,
				MoreartyHelper.getActiveSchoolId(this),
				this.props.onReload
			).createGrid();
		}

	},
	render: function () {
		const binding = this.getDefaultBinding();
		
		binding.set('grid', Immutable.fromJS(this.model.grid));
		return this.model.grid ? <Grid model={this.model.grid}/> : null;
	}
});

module.exports = SportsPage;