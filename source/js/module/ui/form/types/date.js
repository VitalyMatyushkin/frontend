const 	MaskedInput = require('module/ui/masked_input'),
		DateHelper 	= require('module/helpers/date_helper'),
		React 		= require('react');

const MaskedDate =  React.createClass({
	propTypes: {
		value:			React.PropTypes.string,
		defaultValue:	React.PropTypes.string,
		onChange: 		React.PropTypes.func,
		onBlur: 		React.PropTypes.func
	},
	getInitialState:function(){
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

		if(localeDate){
			this.setState({date:localeDate});
			this.props.onChange && this.props.onChange(DateHelper.toIso(localeDate));
		}
		return localeDate;
	},

	handleBlur: function(e) {
		const self = this;
		let value = e.target.value;

        if(!value || value==='__.__.____'){
			value = self.setDefaultValue();
			this.setState({date:value});
		}
		value = value ? DateHelper.toIso(value) : value;

		self.props.onBlur && self.props.onBlur(value);
        e.stopPropagation();
	},
	handleChange: function(e) {
		const self = this,
			inputValue = e.target.value;

		this.setState({date:inputValue});

		self.props.onChange && self.props.onChange(DateHelper.toIso(inputValue));

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