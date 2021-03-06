const	React 			= require ('react'),
		CrossButton		= require('../cross_button/cross_button'),
		{Autocomplete}	= require('../autocomplete2/OldAutocompleteWrapper');

const PostcodeSelector = React.createClass({
	propTypes: {
		region: React.PropTypes.string,
		currentPostcode: React.PropTypes.object,
		extraCssStyle: React.PropTypes.string,
		handleSelectPostcode: React.PropTypes.func.isRequired,
		handleEscapePostcode: React.PropTypes.func.isRequired
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
		if(typeof this.props.region !== 'undefined') {
			postCodeFilter.where.region = this.props.region;
		}

		return window.Server.postCodes.get({ filter: postCodeFilter });
	},
	handleEscapePostcode: function() {
		this.setState({
			postcodeInputKey: this.generatePostcodeInputKey()
		});
		this.props.handleEscapePostcode();
	},
	getExtraCssStyle: function() {
		return typeof this.props.extraCssStyle !== 'undefined' ? this.props.extraCssStyle : '';
	},
	render: function() {
		return (
				<div>
					<Autocomplete
						key				= {this.state.postcodeInputKey}
						placeholder		= "Please enter your postcode"
						serviceFilter	= {this.service}
						serverField		= "postcode"
						onSelect		= {this.props.handleSelectPostcode}
						defaultItem		= {this.props.currentPostcode}
						extraCssStyle	= {this.getExtraCssStyle()}
					/>
					<CrossButton	onClick={this.handleEscapePostcode}/>
				</div>
		)
	}
});

module.exports = PostcodeSelector;