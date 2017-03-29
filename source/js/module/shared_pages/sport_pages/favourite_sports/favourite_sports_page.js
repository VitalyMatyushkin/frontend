const	React			= require('react'),
		Morearty		= require('morearty'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		Grid			= require('module/ui/grid/grid'),
		SportListModel	= require('module/shared_pages/sport_pages/sport_list_model');

const SportsPage = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes:{
		onReload: React.PropTypes.func.isRequired
	},
	componentWillMount: function () {
		this.sportListModel = new SportListModel(
			this,
			MoreartyHelper.getActiveSchoolId(this),
			this.props.onReload
		);
	},
	render: function () {
		return (
			<Grid model={this.sportListModel.grid}/>
		);
	}
});

module.exports = SportsPage;