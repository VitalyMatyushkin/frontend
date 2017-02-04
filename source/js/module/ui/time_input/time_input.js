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
			value:		'00',
			isTyping:	false,
			countCheck:	0
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
		this.setState({countCheck: this.state.countCheck + 1});
		if(matches !== null) {
			const intValue = parseInt(value, 10);

			if(intValue >= 0 && intValue <= this.getMaxLimit()) {
				this.setState({value: value});
				if (this.props.type === TimeInputConsts.TIME_INPUT_TYPE.HOUR && this.state.countCheck == 1) {
					this.input.blur();
				}
			}
		};
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
			case '00':
				this.setState({value: '00'});
				if (this.props.type === TimeInputConsts.TIME_INPUT_TYPE.HOUR) {
					this.input.blur();
				}
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
	handleBlur: function() {
		this.setState({
			isTyping: false,
			countCheck: 0
		});

		if(this.state.value !== '') {
			this.props.handleChange(parseInt(this.state.value, 10));
		}
	},
	render: function () {
		return (
			<input className={ this.props.cssClassName }
				type={ 'text' }
				onChange={ this.handleChange }
				value={ this.state.isTyping === false ? this.fillZero(this.state.value) : this.state.value }
				onFocus={ this.handleFocus }
				onBlur={ this.handleBlur }
				ref={input => {
					this.input = input;
				}}
			/>
		);
	}
});

module.exports = TimeInput;