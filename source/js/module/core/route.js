var Route;

Route = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		path: React.PropTypes.string.isRequired,
		component: React.PropTypes.string.isRequired,
		pageName: React.PropTypes.string,
		loginRoute: React.PropTypes.bool,
		verifyRoute: React.PropTypes.bool,
		unauthorizedAccess: React.PropTypes.bool
	},
	render: function() {
		var self = this;

		null
	}
});

module.exports = Route;
