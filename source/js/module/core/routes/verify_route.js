const 	React 					= require('react'),
		Route 					= require('module/core/route'),
		RegisterDoneComponent 	= require('module/ui/register/user/register_done');

const VerifyRoute = React.createClass({
	getDefaultProps: function() {
		return {
			path: 'verify',
			component: 'module/ui/register/user/register_done',
			verifyRoute: true
		};
	},
	render: function() {
		null;
	}
});

module.exports = VerifyRoute;

