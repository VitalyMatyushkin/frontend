/**
 * Created by Anatoly on 13.06.2016.
 */

const	React		= require('react'),
		Morearty	= require('morearty'),
		TypeMixin	= require('module/ui/form/types/type_mixin'),
		Checkbox	= require('module/ui/checkbox/checkbox');

const TypeCheckbox =  React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	onChange: function(event) {
		const self = this;

		self.setValue(event.target.checked);

		event.stopPropagation();
	},
	render: function () {
		const	self	= this,
				value	= self.getDefaultBinding().get('value');

		return (
			<Checkbox
				isChecked	= { value }
				onChange	= { self.onChange }
			/>
		)
	}
});


module.exports = TypeCheckbox;
