const	CenterView	= require('./center'),
		Morearty	= require('morearty'),
		React 		= require('react');

const ApplicationView = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		return (
			<div>
				<CenterView binding={binding} />
			</div>
		);
	}
});


module.exports = ApplicationView;