const	React			= require('react'),
		Morearty		= require('morearty'),
		Grid			= require('module/ui/grid/grid'),
		PlaceListModel	= require('./place_list_model');

const PlaceList = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.model = new PlaceListModel(this);
	},
	render: function() {
		return (
			<Grid model={this.model.grid}/>
		);
	}
});

module.exports = PlaceList;