var HeadView = require('module/as_manager/head'),
	CenterView = require('module/as_manager/center'),
	React = require('react'),
	ReactDOM = require('reactDom'),
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