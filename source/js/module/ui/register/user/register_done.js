const 	{SVG} 		= require('module/ui/svg'),
		React 		= require('react'),
		Morearty    = require('morearty'),
		{If}		= require('module/ui/if/if');

const RegiseterUserDone = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSuccess: React.PropTypes.func
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		window.simpleAlert(
			'Welcome to Squad In Touch!\nThank you for registering your account with us, you will be granted access as soon as your role has been confirmed by the school administrator or the Squad In Touch support team, if you are registering a new school account.\nThank you for joining us!',
			'Ok',
			() => {
			});

		return (
			<div className="bRegisterMessage">
				{/*Check the type of account registered for by the user and display information accordingly*/}
				<If condition={(binding.get('type')==='teacher' || binding.get('type')==='coach' || binding.get('type')=='parent' || binding.get('type')=='student')}>
					<p className="bRegisterFinish">
						Thank you for joining Squad In Touch. Joining requests are usually confirmed within 1 working day.
						Meanwhile you can log in to your account for managing your profile details.<br/>
						Please be aware that joining requests are confirmed by school administrators and sometimes there can be delays with receiving confirmation.
					</p>
				</If>
				<If condition={(binding.get('type')==='manager' || binding.get('type')=== 'admin')}>
					<p className="bRegisterFinish">
						Thank you for joining Squad In Touch. Joining requests are usually confirmed within 1 working day.
						Meanwhile you can log in to your account for managing your profile details.
					</p>
				</If>
				<div className="bButton" onClick={self.props.onSuccess}>Finish</div>
			</div>
		)
	}
});


module.exports = RegiseterUserDone;
