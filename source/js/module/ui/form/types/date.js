const 	MaskedInput = require('module/ui/masked_input'),
		DateHelper 	= require('module/helpers/date_helper'),
		React 		= require('react');

const MaskedDate =  React.createClass({
	propTypes: {
		value:			React.PropTypes.string,
		defaultValue:	React.PropTypes.string,
		onChange: 		React.PropTypes.func,
		onBlur: 		React.PropTypes.func,
		validateOn: 	React.PropTypes.bool
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

		self.setDefaultValue();
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
		const 	isValid			= date && DateHelper.isValid(date),
				localeDate 		= isValid ? DateHelper.toLocal(date):'';

		if(this.props.validateOn || localeDate){
			this.setState({date:localeDate});
			let isoDate = DateHelper.toIso(localeDate);
			isoDate = DateHelper.isValid(isoDate) ? isoDate : '';
			this.props.onChange && this.props.onChange(isoDate);
		}
		return localeDate;
	},

	handleBlur: function(e) {
		const self = this;
		let value = e.target.value;

		console.log('handleBlur: e.target.value = ' + value);
        if(!value || value==='__.__.____'){
			value = self.setDefaultValue();
			this.setState({date:value});
		}
		value = value ? DateHelper.toIso(value) : value;

		console.log('handleBlur: value = ' + value);

		self.props.onBlur && self.props.onBlur(value);
        e.stopPropagation();
	},
	handleChange: function(e) {
		const self = this,
			inputValue = e.target.value;

		this.setState({date:inputValue});

		let isoDate = DateHelper.toIso(inputValue);
		isoDate = DateHelper.isValid(isoDate) || !this.props.validateOn ? isoDate : '';
		self.props.onChange && self.props.onChange(isoDate);

        e.stopPropagation();
	},
	render: function () {
        const self = this,
			date = self.state.date;

		return (
            <MaskedInput title="Format date dd.mm.yyyy" value={date} className="eDateInput"
                         onBlur={self.handleBlur} onChange={self.handleChange} mask="99.99.9999" />
		)
	}
});


module.exports = MaskedDate;