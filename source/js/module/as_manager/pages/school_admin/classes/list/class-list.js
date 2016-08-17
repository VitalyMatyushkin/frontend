/**
 * Created by Anatoly on 16.08.2016.
 */
const   React 				= require('react'),
		Morearty			= require('morearty'),
		ClassListModel  	= require('./class-list-model'),
		Grid 				= require('module/ui/grid/grid');

const ClassList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.model = new ClassListModel(this);
	},
	render: function () {
		return (
			<Grid model={this.model.grid}/>
		);
	}
});

module.exports = ClassList;