const	React		= require('react'),
		Morearty	= require('morearty'),
		Grid		= require('module/ui/grid/grid'),
		Model		= require('../../../../../shared_pages/sportList/sport_list_model');

const SportList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const globalBinding = this.getMoreartyContext().getBinding(),
			schoolId = globalBinding.get('routing.pathParameters.0');

		this.model = new Model(this, schoolId);
	},
	render: function () {
		return (
			<Grid model={this.model.grid}/>
		);
	}
});

module.exports = SportList;