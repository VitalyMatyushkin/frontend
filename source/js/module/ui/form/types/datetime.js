const 	MaskedInput = require('module/ui/masked_input'),
		DateHelper 	= require('module/helpers/date_helper'),
		React 		= require('react');

const MASKED_INPUT_DATETIME = '__.__.____/__:__';

const MaskedDateTime =  React.createClass({	
	propTypes: {
		value:			React.PropTypes.string,
		defaultValue:	React.PropTypes.string,
		onChange: 		React.PropTypes.func,
		onBlur: 		React.PropTypes.func,
		validateOn: 	React.PropTypes.bool 		//true - validation on, false - off
	},
	getDefaultProps: function(){
		return {
			validateOn: true
		};
	},
	getInitialState: function(){
		return {
			dateTime:''
		};
	},
	componentWillMount: function() {
		this.setDateTime(this.props.value);
	},
	componentWillReceiveProps:function(nextProps){
		if(this.props.defaultValue !== nextProps.defaultValue)
			this.setDefaultValue(nextProps);
		if(this.props.value !== nextProps.value){
			this.setDateTime(nextProps.value);
		}
	},
	setDefaultValue: function(nextProps) {
		const props	= nextProps || this.props;

		return this.setDateTime(props.defaultValue);
	},
	setDateTime: function(dateTime) {
		const 	isValid				= dateTime && DateHelper.isValidDateTime(dateTime),
				localeDateTime 		= isValid ? DateHelper.toLocalDateTime(dateTime) : '';

		if(this.props.validateOn || localeDateTime){
			this.setState({dateTime:localeDateTime});
			this.props.onChange && this.props.onChange(this.toIsoDateTime(localeDateTime));
		}
		return localeDateTime;
	},
	toIsoDateTime:function(localeDateTime){
		const isoDateTime = DateHelper.toIsoDateTime(localeDateTime);
		return localeDateTime && (!this.props.validateOn || DateHelper.isValidDateTime(isoDateTime)) ? isoDateTime : '';
	},	

	handleBlur: function(e) {
		let value = e.target.value;

    if(!value || value === MASKED_INPUT_DATETIME){
			value = this.setDefaultValue();
			this.setState({dateTime:value});
		}
		this.props.onBlur && this.props.onBlur(this.toIsoDateTime(value));
        e.stopPropagation();
	},
	handleChange: function(e) {
		const inputValue = e.target.value;

		this.setState({dateTime:inputValue});

		this.props.onChange && this.props.onChange(this.toIsoDateTime(inputValue));

        e.stopPropagation();
	},
	render: function () {
        const dateTime = this.state.dateTime;

		return (
            <MaskedInput title="Format date-time dd.mm.yyyy/hh:mm" value={dateTime} className="eDateTimeInput"
                         onBlur={this.handleBlur} onChange={this.handleChange} mask="99.99.9999/99:99" />
		)
	}
});


module.exports = MaskedDateTime;