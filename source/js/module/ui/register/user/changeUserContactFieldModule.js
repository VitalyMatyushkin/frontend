const 	React	= require('react'),
		If		= require('module/ui/if/if');

const ChangeUserContactFieldModule = React.createClass({

	propTypes: {
		type:			React.PropTypes.string.isRequired,	// message module can be for phone verification or for email
		serviceName:	React.PropTypes.string.isRequired,	// api service name for change email or phone
		data:			React.PropTypes.string.isRequired	// old email or phone number
	},

	//========== mapping data by type ==========
	LABEL_TEXT: {
		'email': 'Your email',
		'phone': 'Your phone'
	},
	getLabelText: function() {
		return this.LABEL_TEXT[this.props.type];
	},

	ERROR_TEXT: {
		'email': 'This email already used.',
		'phone': 'This phone already used.'
	},
	getErrorText: function() {
		return this.ERROR_TEXT[this.props.type];
	},

	FIELD_NAME: {
		'email': 'email',
		'phone': 'phone'
	},
	getServerFieldName: function() {
		return this.FIELD_NAME[this.props.type];
	},
	//========== mapping data by type ==========

	getInitialState: function() {
		return {
			inputText:		this.props.data,
			isDataResent:	false,
			isError:		false				// is last change email/phone field success?
		};
	},
	handleChangeInput: function(eventDescriptor) {
		this.setState({inputText: eventDescriptor.target.value});
	},
	handleClickResendMessageButton: function() {
		if(typeof this.state.inputText !== 'undefined' && this.state.inputText === '') {
			const dataToSend = {};
			dataToSend[this.getServerFieldName()] = this.state.inputText;

			// TODO check 409 and 500
			window.Server[this.props.serviceName].put(dataToSend)
				.then(() => {
					this.setState( {isDataResent: true} );
				})
				.catch(error => {
					if(error.xhr.status === 409) {
						this.setState( {isError: true} );
					} else {
						this.setState( {isDataResent: true} );
					}
				});
		}
	},
	render: function() {
		let body;

		if(!this.state.isDataResent) {
			body = (
				<label className="eRegistration_label">
				<span className="eRegistration_labelField">
					{ this.getLabelText() }
				</span>
					<input	className	= 'eRegistration_input'
							value		= { this.state.inputText }
							onChange	= { this.handleChangeInput }
					/>
					<If condition={ this.state.isError }>
						<span className="verify_error">{ this.getErrorText() }</span>
					</If>
					<button	className	= "bButton"
							onClick		= { this.handleClickResendMessageButton }
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

module.exports = ChangeUserContactFieldModule;