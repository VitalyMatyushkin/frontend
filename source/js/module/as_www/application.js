var HeadView = require('module/as_www/head'),
	CenterView = require('module/as_www/center'),
	ApplicationView;

ApplicationView = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div>
				<HeadView binding={binding} />
				<div>Hello world</div>
			</div>
		);
	}
});


module.exports = ApplicationView;