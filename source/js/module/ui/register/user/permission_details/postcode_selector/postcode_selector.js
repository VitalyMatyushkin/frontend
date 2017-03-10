const	React 					= require ('react');

const	CrossButton				= require('../../../../../ui/cross_button/cross_button'),
		AutoComplete			= require('../../../../../ui/autocomplete2/OldAutocompleteWrapper');

const	PermissionDetailsHelper	= require('../permission_detail_helper');

const PermissionDetails = React.createClass({
	propTypes: {
		currentPostcode			: React.PropTypes.object,
		handleSelectPostcode	: React.PropTypes.func.isRequired,
		handleEscapePostcode	: React.PropTypes.func.isRequired
	},
	getInitialState: function(){
		// It's auto generated key for postcode input.
		// It exists because we must have opportunity to reset state of this component by hand.
		return {
			postcodeInputKey: this.generatePostcodeInputKey()
		};
	},
	generatePostcodeInputKey: function() {
		// just current date in timestamp view
		return + new Date();
	},
	service: function (postcode) {
		const postCodeFilter = {
			where: {
				postcode: {
					like	: postcode,
					options	: 'i'
				}
			},
			limit: 10
		};

		return window.Server.postCodes.get({ filter: postCodeFilter });
	},
	handleEscapePostcode: function() {
		this.setState({
			postcodeInputKey: this.generatePostcodeInputKey()
		});
		this.props.handleEscapePostcode();
	},
	render: function() {
		return (
				<div>
					<AutoComplete	key				= {this.state.postcodeInputKey}
									placeholder		= "your postcode"
									serviceFilter	= {this.service}
									serverField		= "postcode"
									onSelect		= {this.props.handleSelectPostcode}
									defaultItem		= {this.props.currentPostcode}
									extraCssStyle	= {'mRegistrationPostcode'}
					/>
					<CrossButton	onClick={this.handleEscapePostcode}/>
				</div>
		)
	}
});

module.exports = PermissionDetails;