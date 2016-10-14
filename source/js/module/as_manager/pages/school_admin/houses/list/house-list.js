/**
 * Created by Anatoly on 16.08.2016.
 */
const   React 				= require('react'),
		Morearty			= require('morearty'),
		HouseListModel  	= require('./house-list-model'),
		Grid 				= require('module/ui/grid/grid');

const HouseList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.model = new HouseListModel(this);
	},
	render: function () {
		return (
			<Grid model={this.model.grid}/>
		);
	}
});

module.exports = HouseList;