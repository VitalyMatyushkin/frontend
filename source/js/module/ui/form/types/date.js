const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		MaskedInput = require('module/ui/masked_input'),
		React 		= require('react'),
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
		const self = this,
			binding = self.getDefaultBinding();

		// На случай, если форма заполняется асинхронно
        self.addBindingListener(binding, 'defaultValue', changes => self._forceNewValue(changes.getCurrentValue()));
        self.addBindingListener(binding, 'localValue', changes => self.setValue(self._toIso(changes.getCurrentValue())));
	},
	_forceNewValue: function(value) {
		const self = this,
            binding = self.getDefaultBinding(),
            locales = self.props.locales,
            options = self.props.options,
			dateStr = !self.fullValidate(value) ? new Date(value).toLocaleDateString(locales, options).replace(/[/]/g, '.'):'';

        binding.set('localValue', dateStr);
	},
	_toIso: function(dotString) {
		const dateParts = dotString ? dotString.split('.'):[],
            //ISO format date for locales == 'en-GB', format == 'yyyy.mm.dd'
            isoStr = dateParts[2]+'-'+ dateParts[1]+'-'+ dateParts[0];

        return !this.fullValidate(isoStr)? new Date(isoStr).toISOString().substr(0, 10):isoStr;
	},
	handleBlur: function(e) {
		const self = this,
            defaultValue = self.getDefaultBinding().get('defaultValue'),
			inputValue = e.target.value;

        if(!inputValue || inputValue==='__.__.____')
            self._forceNewValue(defaultValue);

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
            <MaskedInput ref="fieldInput" title="Format date dd.mm.yyyy" value={localValue}
                         onBlur={self.handleBlur} onChange={self.handleChange} mask="99.99.9999" />
		)
	}
});


module.exports = TypeDate;