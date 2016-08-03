const 	MaskedInput = require('module/ui/masked_input'),
		DateHelper 	= require('module/helpers/date_helper'),
		React 		= require('react');

const TypeDate =  React.createClass({
	propTypes: {
		value:			React.PropTypes.string,
		onChange: 		React.PropTypes.func,
		locales: 		React.PropTypes.string,
		options:		React.PropTypes.object
	},
    getDefaultProps: function() {
        return {
            locales:'en-GB',
            options:{
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }
        };
    },
	componentWillMount: function() {
		const self 			= this;

		self.setLocalValue();
	},
	setLocalValue: function() {
		const self 			= this,
			value			= self.props.value,
            locales 		= self.props.locales,
            options 		= self.props.options,
			isValid			= !!value && !self.fullValidate(value),
			localeDate 		= isValid ? new Date(value).toLocaleDateString(locales, options).replace(/[/]/g, '.'):'';

		if(isValid){
		}
	},
	_toIso: function(dotString) {
		const dateParts = dotString ? dotString.split('.'):[],
            //ISO format date for locales == 'en-GB', format == 'yyyy-mm-dd'
            isoStr = dateParts[2]+'-'+ dateParts[1]+'-'+ dateParts[0];

        return isoStr;
	},
	handleBlur: function(e) {
		const self = this,
			inputValue = e.target.value;

        if(!inputValue || inputValue==='__.__.____')
            self.setLocalValue();

        e.stopPropagation();
	},
	handleChange: function(e) {
		const self = this,
			inputValue = e.target.value;

        e.stopPropagation();
	},
	render: function () {
        const self = this;

		return (
            <MaskedInput title="Format date dd.mm.yyyy" value={localValue} className="eDateInput"
                         onBlur={self.handleBlur} onChange={self.handleChange} mask="99.99.9999" />
		)
	}
});


module.exports = TypeDate;