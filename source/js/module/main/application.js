var RouterView = require('module/core/router'),
	HeadView = require('module/main/head'),
	CenterView = require('module/main/center'),
	ApplicationView;

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

module.exports = ApplicationView;