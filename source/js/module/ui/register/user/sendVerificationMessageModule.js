const 	React 		= require('react'),
		classNames	= require('classnames');

const SendVerificationMessageModule = React.createClass({
	propTypes: {
		text:					React.PropTypes.string.isRequired,
		serviceName:			React.PropTypes.string.isRequired,
		fieldName:				React.PropTypes.string.isRequired,
		data:					React.PropTypes.string.isRequired
	},
	getInitialState: function() {
		return {
			inputText:		this.props.data,
			isDataResent:	false
		};
	},
	handleChangeInput: function(eventDescriptor) {
		this.setState({inputText: eventDescriptor.target.value});
	},
	handleClickResendMessageButton: function() {
		const dataToSend = {};
		dataToSend[this.props.fieldName] = this.state.inputText;

		// TODO check 409 and 500
		window.Server[this.props.serviceName].put(dataToSend)
			.then(() => {
				this.setState( {isDataResent: true} );
			})
			.catch(() => {
				this.setState( {isDataResent: true} );
			});
	},
	render: function() {
		let body;

		if(!this.state.isDataResent) {
			body = (
				<label className="eRegistration_label">
				<span className="eRegistration_labelField">
					{this.props.text}
				</span>
					<input	className	= 'eRegistration_input'
							  value		= { this.state.inputText }
							  onChange	= { this.handleChangeInput }
					/>
					<button	className	=	"bButton"
							   onClick	=	{ this.handleClickResendMessageButton }
					>
						Resend
					</button>
				</label>
			);
		} else {
			body = (
				<span>Verification was sent</span>
			)
		}

		return (
			<div>
				{body}
			</div>
		);
	}
});

module.exports = SendVerificationMessageModule;



