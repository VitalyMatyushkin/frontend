/**
 * Created by vitaly on 12.09.17.
 */
const React = require('react');

const TextInput = React.createClass({
	propTypes:{
		id:				React.PropTypes.string,
		value:			React.PropTypes.string,
		placeholder:	React.PropTypes.string,
		isDisabled:		React.PropTypes.bool,
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
		const newValue = event.target.value;

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
				type			= { 'number' }
				placeholder		= { this.props.placeholder }
				value			= { this.state.value }
				disabled		= { !!this.props.isDisabled }
				onChange		= { this.handleChange }
				onFocus			= { this.props.handleFocus }
			/>
		)
	}
});

module.exports = TextInput;