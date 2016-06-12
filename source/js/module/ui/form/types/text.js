const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		React 		= require('react');

const TypeText =  React.createClass({
	propTypes: {
		textType: 		React.PropTypes.string
	},
	mixins: [Morearty.Mixin, TypeMixin],
	componentWillMount: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		// For case when form filled async
		binding.addListener('defaultValue', function() {
			self.fullValidate(binding.get('defaultValue'));
		});
	},
	handleBlur: function(event) {
		this.setValue(event.target.value);
	},
	handleChange: function(event) {
		this.changeValue(event.target.value);
	},
	render: function () {
		const 	self 	= this,
				value 	= self.getDefaultBinding().get('value');

		return (
			<div className="eForm_fieldInput">
				<input value={value} type={self.props.textType || 'text'} placeholder={self.props.placeholder}
					   onBlur={self.handleBlur} onChange={self.handleChange} />
			</div>
		)
	}
});


module.exports = TypeText;