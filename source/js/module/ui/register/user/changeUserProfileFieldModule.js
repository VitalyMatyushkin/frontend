const 	React	= require('react'),
	{If}	= require('module/ui/if/if');

const ChangeUserProfileFieldModule = React.createClass({

	propTypes: {
		labelText:					React.PropTypes.string.isRequired,
		successText:				React.PropTypes.string.isRequired,
		errorText:					React.PropTypes.string.isRequired,
		serverFieldName:			React.PropTypes.string.isRequired,
		service:					React.PropTypes.object.isRequired,
		data:						React.PropTypes.string.isRequired,	// old email or phone number
		handleSuccessDataChange:	React.PropTypes.func.isRequired
	},

	getInitialState: function() {
		return {
			inputText:		this.props.data,
			isDataResent:	false,
			isError:		false
		};
	},
	handleChangeInput: function(eventDescriptor) {
		this.setState( {inputText: eventDescriptor.target.value} );
	},
	// TODO rename method
	handleClickResendMessageButton: function() {
		if(typeof this.state.inputText !== 'undefined' && this.state.inputText !== '') {
			const dataToSend = {};
			dataToSend[this.props.serverFieldName] = this.state.inputText;

			this.props.service.put(dataToSend)
				.then(() => {
					// TODO rename isDataResent
					this.setState( {isDataResent: true} );
					this.props.handleSuccessDataChange(this.state.inputText);
				})
				.catch(error => {
					if(error.xhr.status === 409) {
						// TODO rename isError
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
				<div className="eRegistration_labelField">
					{ this.props.labelText }
				</div>
					<input	className	= 'eRegistration_input mFullWidth'
							value		= { this.state.inputText }
							onChange	= { this.handleChangeInput }
					/>
					<If condition={ this.state.isError }>
						<span className="verify_error">{ this.props.errorText }</span>
					</If>
					<button	className	= "bButton"
							onClick		= { this.handleClickResendMessageButton }
					>
						Save
					</button>
				</label>
			);
		} else {
			body = (
				<span>{ this.props.successText }</span>
			)
		}

		return (
			<div>
				{body}
			</div>
		);
	}
});

module.exports = ChangeUserProfileFieldModule;