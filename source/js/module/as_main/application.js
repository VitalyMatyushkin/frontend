var HeadView = require('module/as_main/head'),
	CenterView = require('module/as_main/center'),
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


module.exports = ApplicationView;