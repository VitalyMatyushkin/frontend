var HeadView = require('module/as_parents/head'),
	CenterView = require('module/as_parents/center'),
	React = require('react'),
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