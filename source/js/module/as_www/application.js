const 	HeadView 	= require('module/as_www/head'),
		CenterView 	= require('module/as_www/center'),
		Morearty    = require('morearty'),
		React 		= require('react');

const ApplicationView = React.createClass({
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