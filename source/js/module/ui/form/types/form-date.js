const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		Date 		= require('module/ui/form/types/date'),
		React 		= require('react'),
		Morearty	= require('morearty');

const TypeDate =  React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	render: function () {
        const self = this,
            binding = self.getDefaultBinding(),
			value = binding.get('value'),
			defaultValue = binding.get('defaultValue');

		return (
            <Date defaultValue={defaultValue} value={value} onChange={self.changeValue} onBlur={self.setValue} />
		)
	}
});


module.exports = TypeDate;