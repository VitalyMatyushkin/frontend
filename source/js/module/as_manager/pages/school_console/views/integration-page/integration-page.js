/**
 * Created by Woland on 10.02.2017.
 */

const 	React 					= require('react'),
		Morearty				= require('morearty'),
		IntegrationPageModel	= require('./integration-page-model'),
		Grid 					= require('module/ui/grid/grid');

const IntegrationPage = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.model = new IntegrationPageModel(this);
	},
	render: function () {
		return this.model.grid ? <Grid model={this.model.grid}/> : null;
	}
});

module.exports = IntegrationPage;