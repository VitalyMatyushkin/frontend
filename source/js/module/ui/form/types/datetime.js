const 	MaskedInput = require('module/ui/masked_input'),
		DateHelper 	= require('module/helpers/date_helper'),
		React 		= require('react');

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
		const self = this;

		self.setDateTime(self.props.value);
	},
	componentWillReceiveProps:function(nextProps){
		const self = this;

		if(self.props.defaultValue !== nextProps.defaultValue)
			self.setDefaultValue(nextProps);
		if(self.props.value !== nextProps.value){
			self.setDateTime(nextProps.value);
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
		let isoDateTime = DateHelper.toIsoDateTime(localeDateTime);
		return localeDateTime && (!this.props.validateOn || DateHelper.isValidDateTime(isoDateTime)) ? isoDateTime : '';
	},	

	handleBlur: function(e) {
		const self = this;
		let value = e.target.value;

    if(!value || value==='__.__.____ __:__'){
			value = self.setDefaultValue();
			this.setState({dateTime:value});
		}
		self.props.onBlur && self.props.onBlur(this.toIsoDateTime(value));
        e.stopPropagation();
	},
	handleChange: function(e) {
		const self = this,
			inputValue = e.target.value;

		this.setState({dateTime:inputValue});

		self.props.onChange && self.props.onChange(this.toIsoDateTime(inputValue));

        e.stopPropagation();
	},
	render: function () {
        const self = this,
			dateTime = self.state.dateTime;

		return (
            <MaskedInput title="Format date-time dd.mm.yyyy hh:mm" value={dateTime} className="eDateTimeInput"
                         onBlur={self.handleBlur} onChange={self.handleChange} mask="99.99.9999 99:99" />
		)
	}
});


module.exports = MaskedDateTime;