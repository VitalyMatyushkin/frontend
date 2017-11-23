/**
 * Created by Anatoly on 18.08.2016.
 */
const   React 				= require('react'),
		Morearty			= require('morearty'),
		SportListModel  	= require('./sport-list-model'),
	{Grid}				= require('module/ui/grid/grid');

const SportList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.model = new SportListModel(this);
	},
	render: function () {
		return (
			<Grid model={this.model.grid}/>
		);
	}
});

module.exports = SportList;