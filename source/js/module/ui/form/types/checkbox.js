/**
 * Created by Anatoly on 13.06.2016.
 */

const	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		React		= require('react'),
		Morearty	= require('morearty');

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
			<div className="eForm_fieldInput">
				<input className="eSwitch" type="checkbox" checked={value} onChange={self.onChange} />
				<label/>
			</div>
		)
	}
});


module.exports = TypeCheckbox;
