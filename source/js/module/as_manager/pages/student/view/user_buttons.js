const 	Morearty    = require('morearty'),
		React 		= require('react');

const UserButtons = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const 	self = this,
				binding = self.getDefaultBinding();

		return (
			<div className="bUserButtons">
				<div className="bButton">Invite to an event</div>
			</div>
		)
	}
});


module.exports = UserButtons;
