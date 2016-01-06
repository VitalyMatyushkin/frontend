var RegiseterUserDone,
	SVG = require('module/ui/svg'),
	React = require('react'),
	If = require('module/ui/if/if');

RegiseterUserDone = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSuccess: React.PropTypes.func
	},
	render: function() {
		var self = this;

		return (
			<div className="bPageMessage">
				<h2>Registration almost done</h2>

				<p className="bRegisterFinish">
					Expect confirmation of the invitation.
					Now you can go to your profile page and fill additional information.
				</p>

				<div className="bButton" onClick={self.props.onSuccess}>Finish</div>
			</div>
		)
	}
});


module.exports = RegiseterUserDone;
