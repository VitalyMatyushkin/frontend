/**
 * Created by Anatoly on 18.08.2016.
 */
const   React 			= require('react'),
		Morearty		= require('morearty'),
		NewsListModel  	= require('./news-list-class'),
		{Grid} 			= require('module/ui/grid/grid'),
		Immutable		= require('immutable');

const NewsList = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		//The function, which will call when user click on <Row> in Grid
		handleClick: React.PropTypes.func,
		region: React.PropTypes.string
	},
	componentWillMount: function () {
		const 	binding 	= this.getDefaultBinding(),
				grid 		= binding.toJS('grid');
		
		if (grid) {
			this.model = new NewsListModel(this).createGridFromExistingData(grid);
		} else {
			this.model = new NewsListModel(this).createGrid();
		}
	},
	render: function () {
		const binding = this.getDefaultBinding();
		
		binding.set('grid', Immutable.fromJS(this.model.grid));
		return this.model.grid ? <Grid model={this.model.grid} id="news_table"/> : null;
	}
});

module.exports = NewsList;