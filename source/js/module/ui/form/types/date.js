const 	MaskedInput = require('module/ui/masked_input'),
		{DateHelper} 	= require('module/helpers/date_helper'),
		React 		= require('react');

const MaskedDate =  React.createClass({
	propTypes: {
		value:			React.PropTypes.string,
		defaultValue:	React.PropTypes.string,
		onChange: 		React.PropTypes.func,
		onBlur: 		React.PropTypes.func,
        validateOn: 	React.PropTypes.bool, 		//true - validation on, false - off
		region:         React.PropTypes.string
	},
	getDefaultProps: function(){
		return {
			validateOn: true
		};
	},
	getInitialState: function(){
		return {
			date:''
		};
	},
	componentWillMount: function() {
		const self = this;

		self.setDate(self.props.value);
	},
	componentWillReceiveProps:function(nextProps){
		const self = this;

		if(self.props.defaultValue !== nextProps.defaultValue)
			self.setDefaultValue(nextProps);
		if(self.props.value !== nextProps.value){
			self.setDate(nextProps.value);
		}
	},
	setDefaultValue: function(nextProps) {
		const props	= nextProps || this.props;

		return this.setDate(props.defaultValue);
	},
	setDate: function(date) {
		const 	isValid			= date && this.isValid(date),
				localeDate 		= isValid ? (this.props.region === 'US' ? DateHelper.toLocalForUS(date) : DateHelper.toLocalForGB(date))
					:'';

		if(this.props.validateOn || localeDate){
			this.setState({date:localeDate});
			this.props.onChange && this.props.onChange(this.toIso(localeDate));
		}
		return localeDate;
	},
	toIso:function(localeDate){
		let isoDate = this.toIsoString(localeDate);
		return localeDate && (!this.props.validateOn || this.isValid(isoDate)) ? isoDate : '';
	},
	/** convert local date format 'dd.mm.yyyy' to ISO-string */
	toIsoString: function(dotString) {
		const dateParts = dotString ? dotString.split('.'):[],
			isoStr = dateParts[2]+'-'+ dateParts[1]+'-'+ dateParts[0];

		return isoStr;
	},
	isValid: function (date) {
		return this.props.region === 'US' ?  DateHelper.isValidForUS(date) : DateHelper.isValidForGB(date);
	},
	handleBlur: function(e) {
		const self = this;
		let value = e.target.value;

        if(!value || value==='__.__.____'){
			value = self.setDefaultValue();
			this.setState({date:value});
		}
		self.props.onBlur && self.props.onBlur(this.toIso(value));
        e.stopPropagation();
	},
	handleChange: function(e) {
		const self = this,
			inputValue = e.target.value;

		this.setState({date:inputValue});

		self.props.onChange && self.props.onChange(this.toIso(inputValue));

        e.stopPropagation();
	},
	render: function () {
		const   date = this.state.date,
				title = this.props.region === 'US' ? "Format date mm.dd.yyyy" : "Format date dd.mm.yyyy",
				placeholder = this.props.region === 'US' ? "mm.dd.yyyy" : "dd.mm.yyyy";
		return (
			<MaskedInput
				title		= {title}
				value		= {date}
				id 			= {this.props.id}
				className	= "eDateInput"
				onBlur		= {this.handleBlur}
				onChange	= {this.handleChange}
				mask		= "99.99.9999"
				placeholder	= {placeholder}
			/>
		)
	}
});


module.exports = MaskedDate;