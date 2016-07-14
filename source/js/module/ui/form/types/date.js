const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		MaskedInput = require('module/ui/masked_input'),
		React 		= require('react'),
		Morearty	= require('morearty'),
    	Immutable 	= require('immutable');

const TypeDate =  React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
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
    getDefaultState: function() {
        return Immutable.fromJS({
            localValue:'',  //local format date
            value:'',       //ISO format date
            defaultValue:'' //initial date
        });
    },
	componentWillMount: function() {
		const self 			= this,
			binding 		= self.getDefaultBinding();

		self._setDefaultValue();
        self.addBindingListener(binding, 'defaultValue', self._setDefaultValue);
        self.addBindingListener(binding, 'localValue', changes => self.setValue(self._toIso(changes.getCurrentValue())));
	},
	_setDefaultValue: function() {
		const self 			= this,
            binding 		= self.getDefaultBinding(),
			value			= binding.get('defaultValue'),
            locales 		= self.props.locales,
            options 		= self.props.options,
			isValid			= !!value && !self.fullValidate(value),
			localeDate 		= isValid ? new Date(value).toLocaleDateString(locales, options).replace(/[/]/g, '.'):'',
			isoValue 	 	= isValid ? new Date(value).toISOString().substr(0, 10) : value;

		if(isValid){
			binding.atomically()
				.set('defaultValue', isoValue)
				.set('value', isoValue)
				.set('localValue', localeDate)
				.commit();
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
            self._setDefaultValue();

        e.stopPropagation();
	},
	handleChange: function(e) {
		const self = this,
            binding = self.getDefaultBinding(),
			inputValue = e.target.value;

        binding.set('localValue', inputValue);
        e.stopPropagation();
	},
	render: function () {
        const self = this,
            binding = self.getDefaultBinding(),
            localValue = binding.get('localValue');

		return (
            <MaskedInput title="Format date dd.mm.yyyy" value={localValue} className="eDateInput"
                         onBlur={self.handleBlur} onChange={self.handleChange} mask="99.99.9999" />
		)
	}
});


module.exports = TypeDate;