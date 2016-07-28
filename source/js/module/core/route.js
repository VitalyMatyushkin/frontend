const	React 		= require('react'),
		Morearty	= require('morearty');

const Route = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		path: 				React.PropTypes.string.isRequired,
		component: 			React.PropTypes.object.isRequired,
		pageName: 			React.PropTypes.string,
		loginRoute: 		React.PropTypes.bool,
		verifyRoute: 		React.PropTypes.bool,
		unauthorizedAccess: React.PropTypes.bool
	},
	render: function() {
		null;
	}
});

module.exports = Route;
