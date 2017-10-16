/**
 * Created by vitaly on 16.10.17.
 */
const React = require('react');

const TextInput = React.createClass({
	propTypes:{
		id:				React.PropTypes.string,
		textType:		React.PropTypes.string,
		value:			React.PropTypes.string,
		currencySymbol:	React.PropTypes.string,
		placeholder:	React.PropTypes.string,
		disabled:		React.PropTypes.bool,
		handleBlur:		React.PropTypes.func,
		handleFocus:	React.PropTypes.func,
		handleChange:	React.PropTypes.func
	},
	getInitialState: function(){
		return {
			value: ''
		};
	},
	componentWillMount: function() {
		typeof this.props.value !== 'undefined' && this.setState({value: this.props.value});
	},
	componentWillReceiveProps: function(newProps) {
		newProps.value !== this.state.value && this.setState( {value: newProps.value} );
	},
	handleBlur: function() {
		typeof this.props.handleBlur !== 'undefined' && this.props.handleBlur(this.state.value);
	},
	handleChange: function(event) {
		let newValue = event.target.value.replace(this.props.currencySymbol, '');

		if (newValue.indexOf(".") !== -1) {
			newValue = newValue.substring(0, newValue.indexOf(".") + 3);
		}
		this.setState({value: newValue});
		typeof this.props.handleChange !== 'undefined' && this.props.handleChange(newValue);
	},
	render: function () {

		// may be we don't need some hardcode props
		// because it's copy paste from form text component
		return (
			<input
				ref				= "input"
				autoComplete	= "new-password"
				autoCorrect		= "off"
				spellCheck		= "false"

				id				= { this.props.id }
				type			= { this.props.textType || 'text' }
				placeholder		= { this.props.placeholder }
				value			= { this.props.currencySymbol + this.state.value }
				disabled		= { Boolean(this.props.disabled) }
				onChange		= { this.handleChange }
				onFocus			= { this.props.handleFocus }
			/>
		)
	}
});

module.exports = TextInput;