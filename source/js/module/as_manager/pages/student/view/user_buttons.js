var UserButtons,
	React = require('react');

UserButtons = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="bUserButtons">
				<div className="bButton">Invite to an event</div>
			</div>
		)
	}
});


module.exports = UserButtons;
