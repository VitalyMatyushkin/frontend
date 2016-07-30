const	React 		= require('react'),
		Morearty	= require('morearty');

const Route = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		path: 				React.PropTypes.string.isRequired,
		component: 			React.PropTypes.func.isRequired,	// I'm not sure if `func` if proper data type. But it satisfies checker. Maybe there is something more special
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
