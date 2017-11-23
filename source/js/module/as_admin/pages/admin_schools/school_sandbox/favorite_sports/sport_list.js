const	React		= require('react'),
		Morearty	= require('morearty'),
	{Grid}	= require('module/ui/grid/grid'),
		Model		= require('../../../../../shared_pages/sport_pages/sport_list_model');

const SportList = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes:{
		onReload: React.PropTypes.func.isRequired
	},
	componentWillMount: function () {
		const globalBinding = this.getMoreartyContext().getBinding(),
			schoolId = globalBinding.get('routing.pathParameters.0');

		this.model = new Model(this, schoolId, this.props.onReload);
		this.model.createGrid();
	},
	render: function () {
		return (
			<Grid model={this.model.grid}/>
		);
	}
});

module.exports = SportList;