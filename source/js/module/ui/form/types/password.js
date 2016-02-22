const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		React 		= require('react');

const TypePassword =  React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	componentWillMount: function() {
	},
	handleBlur: function(event) {
		this.setValue(event.target.value);
	},
	handleChange: function(event) {
		this.changeValue(event.target.value);
	},
	render: function () {
		const 	self 			= this,
				value 	= self.getDefaultBinding().get('value');

		return (
			<div className="eForm_fieldInput">
				<input type="password" onBlur={self.handleBlur} onChange={self.handleChange} value={value} />
			</div>
		)
	}
});


module.exports = TypePassword;