const	React			= require('react'),
		Morearty		= require('morearty'),
		MoreartyHelper	= require('../../../../../helpers/morearty_helper'),
		Grid			= require('module/ui/grid/grid'),
		Model			= require('../../../../../shared_pages/sportList/sport_list_model');

const SportsPage = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes:{
		onReload: React.PropTypes.func.isRequired
	},
	componentWillMount: function () {
		this.model = new Model(
			this,
			MoreartyHelper.getActiveSchoolId(this),
			this.props.onReload
		);
	},
	render: function () {
		return (
			<Grid model={this.model.grid}/>
		);
	}
});

module.exports = SportsPage;