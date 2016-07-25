/**
 * Created by Anatoly on 25.07.2016.
 */

const   React 	= require('react'),
	Morearty		= require('morearty'),
	Grid = require('module/ui/grid/grid');

const Users = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
	},
	render: function() {
		return <Grid />;
	}
});

module.exports = Users;