var RouterView = require('module/core/router'),
	HeadView = require('module/main/head'),
	CenterView = require('module/main/center'),
	ApplicationView,
	ApplicationWithCtx,
	Ctx;

Ctx = Morearty.createContext({
	userData: {
		authorizationInfo: false,
		registerModal: {
			isOpened: false
		}
	},
	routing: {
		current_page: 'main'
	}
});

ApplicationView = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div>
				<HeadView binding={binding} />
				<CenterView binding={binding} />
			</div>
		);
	}
});

// Routing v0.01
//<div><RouterView routes={ binding.sub('routing') } binding={binding} /></div>

ApplicationWithCtx = Ctx.bootstrap(ApplicationView);

React.render(
	<ApplicationWithCtx />,
	document.getElementById('jsMain')
);