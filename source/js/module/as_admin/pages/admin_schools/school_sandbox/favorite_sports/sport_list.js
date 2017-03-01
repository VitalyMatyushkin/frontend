const	React		= require('react'),
		Morearty	= require('morearty');

const	Grid		= require('module/ui/grid/grid'),
		Model		= require('./sport_list_model');

const SportList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.model = new Model(this);
	},
	render: function () {
		return (
			<Grid model={this.model.grid}/>
		);
	}
});

module.exports = SportList;