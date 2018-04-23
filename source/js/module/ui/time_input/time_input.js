const	React			= require('react'),

		TimeInputConsts	= require('./const');

const TimeInput = React.createClass({
	propTypes: {
		cssClassName:	React.PropTypes.string.isRequired,
		type:			React.PropTypes.string.isRequired,
		handleChange:	React.PropTypes.func.isRequired,
		value:			React.PropTypes.number.isRequired,
		focus:			React.PropTypes.bool
	},
	getInitialState: function(){
		return {
			value:		'',
			isTyping:	false
		};
	},

	componentWillReceiveProps:function(nextProps){
		if(this.props.type === TimeInputConsts.TIME_INPUT_TYPE.MINUTES && this.props.focus != nextProps.focus && nextProps.focus != false) {
			this.setState({
				value:		'',
				isTyping:	true
			});
			this.input.focus();
		}
	},
	/**
	 * Parse new value, check new value.
	 * If all is ok, set it to state.
	 * @param value
	 */
	processNewValue: function(value) {
		// It should be number
		// And it should exact match
		const matches = value.match(/^[0-9]{1,2}$/);
		if(matches !== null) {
			const intValue = parseInt(value, 10);

			if(intValue >= 0 && intValue <= this.getMaxLimit()) {
				this.setState({value: value});
				//If user enter two numbers in hour input, we must change focus to minutes input
				const matchTwoNumbers = value.match(/^[0-9]{2}$/);
				if (matchTwoNumbers !== null && this.props.type === TimeInputConsts.TIME_INPUT_TYPE.HOUR) {
					this.setState({isTyping: false});
					this.input.blur(); // it will call this.handleBlur automatically
				}
			}
		}
	},
	fillZero: function(_value) {
		const value = String(_value).trim();

		switch (value.trim()) {
			case '':
				return '00';
			case '0':
				return '00';
			case '00':
				return '00';
			default:
				const intValue = parseInt(value, 10);
				if(intValue < 10) {
					return '0' + intValue;
				} else {
					return value;
				}
		}
	},
	/**
	 * Get maximum limit for time input.
	 * It's dependent of time type: minute, hour.
	 * @returns {number}
	 */
	getMaxLimit: function() {
		switch (this.props.type) {
			case TimeInputConsts.TIME_INPUT_TYPE.HOUR:
				return 23;
			case TimeInputConsts.TIME_INPUT_TYPE.MINUTES:
				return 59;
		}
	},

	handleChange: function(e) {
		const value = e.target.value.trim();

		switch (value) {
			case '':
				this.setState({value: ''});
				break;
			default:
				this.processNewValue(value);
				break;
		}
	},
	handleFocus: function() {
		this.setState({
			value		: '',
			isTyping	: true
		});
	},
	handleBlur: function(e) {
		this.setState({isTyping: false});

		if(e.target.value !== '') {
			this.props.handleChange(parseInt(e.target.value, 10));
		} else {
			this.props.handleChange(0);
		}
	},
	render: function () {
		return (
			<input	className	= { this.props.cssClassName }
					type		= { 'text' }
					onChange	= { this.handleChange }
					value		= { this.state.isTyping ? this.state.value : this.fillZero(this.props.value) }
					onFocus		= { this.handleFocus }
					onBlur		= { this.handleBlur }
					ref			= { input => {this.input = input;} }
			/>
		);
	}
});

module.exports = TimeInput;