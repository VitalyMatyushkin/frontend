/**
 * Created by Anatoly on 18.08.2016.
 */
const   React 			= require('react'),
		Morearty		= require('morearty'),
		NewsListModel  	= require('./news-list-model'),
		Grid 			= require('module/ui/grid/grid');

const NewsList = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		//The function, which will call when user click on <Row> in Grid
		handleClick: React.PropTypes.func
	},
	componentWillMount: function () {
		this.model = new NewsListModel(this);
	},
	render: function () {
		return (
			<Grid model={this.model.grid}/>
		);
	}
});

module.exports = NewsList;