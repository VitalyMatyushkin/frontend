const TypeMixin = require('module/ui/form/types/type_mixin'),
	MaskedInput = require('module/ui/masked_input'),
	React = require('react'),
    Immutable 	= require('immutable'),
    dateFormat = 'dd.mm.yyyy',

TypeDate =  React.createClass({
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
            localValue:''
        });
    },
	componentWillMount: function() {
		const self = this,
			binding = self.getDefaultBinding();

		// На случай, если форма заполняется асинхронно
		binding.addListener('defaultValue', function() {
			self._forceNewValue(binding.get('defaultValue'));
		});
	},
	_forceNewValue: function(value) {
		const self = this,
            binding = self.getDefaultBinding(),
            locales = self.props.locales,
            options = self.props.options,
			dateStr = Date.parse(value) ? new Date(value).toLocaleDateString(locales, options).replace(/[/]/g, '.'):'';

        binding.set('localValue', dateStr);
	},
	_toIso: function(dotString) {
		const dateParts = dotString !== undefined ? dotString.split('.'):'',
            isoStr = dateParts.length === 3 ? dateParts[2]+'-'+ dateParts[1]+'-'+ dateParts[0]:dotString;

        return Date.parse(isoStr) ? new Date(isoStr).toISOString():isoStr;
	},
	handleBlur: function(e) {
		var self = this,
            defaultValue = self.getDefaultBinding().get('defaultValue'),
			inputValue = e.target.value;

        if(!inputValue || inputValue==='__.__.____')
            self._forceNewValue(defaultValue);
        else
            self.setValue(self._toIso(inputValue));
	},
	handleChange: function(e) {
		var self = this,
            binding = self.getDefaultBinding(),
			inputValue = e.target.value;

        binding.set('localValue', inputValue);
	},
	render: function () {
        const self = this,
            binding = self.getDefaultBinding(),
            localValue = binding.get('localValue');

		return (
			<div className="eForm_fieldInput">
				<MaskedInput ref="fieldInput" value={localValue} onBlur={self.handleBlur} onChange={self.handleChange} mask="99.99.9999" />
			</div>
		)
	}
});


module.exports = TypeDate;