var RegiseterUserDone,
	SVG = require('module/ui/svg');

RegiseterUserDone = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this;

		return (
			<div className="bPageMessage">
				<h2>Registration almost done</h2>
				<div className="bVerifyRegister">
					<div className="eVerifyRegister_text">Get verified and prove your're you</div>

					<div className="eVerifyRegister_field mEmail">
						<div className="eVerifyRegister_fieldText"><SVG icon="icon_envelope" />Confirmation email has been successfully sent to your email address.<br/> Enter the code from the message below:</div>
						<input className="eVerifyRegister_fieldInput" />
						<div className="bButton">check</div>
					</div>

					<div className="eVerifyRegister_field mPhone">
						<div className="eVerifyRegister_fieldText"><SVG icon="icon_phone" />Confirmation text has been successfully sent to your phone.<br/> Enter the code from the message below:</div>
						<input className="eVerifyRegister_fieldInput" />
						<div className="bButton">check</div>
					</div>
				</div>

			</div>
		)
	}
});


module.exports = RegiseterUserDone;
