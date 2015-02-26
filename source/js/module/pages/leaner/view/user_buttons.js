var UserButtons;

UserButtons = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="bUserButtons">
				<div className="bButton">Send message</div>
				<div className="bButton">Invite to the house</div>
				<div className="bButton">Invite to an event</div>
			</div>
		)
	}
});


module.exports = UserButtons;
