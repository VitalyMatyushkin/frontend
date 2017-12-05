/**
 * Created by vitaly on 27.11.17.
 */

const   React 					= require('react'),
		Morearty				= require('morearty'),
		{SessionsModel}			= require('./sessions-model'),
		{Grid}					= require('module/ui/grid/grid');

const Sessions = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		userId: React.PropTypes.string.isRequired
	},
	componentWillMount: function () {
		this.model = new SessionsModel(this).init();
	},
	render: function () {
		return <Grid model={this.model.grid}/>;
	}
});

module.exports = Sessions;