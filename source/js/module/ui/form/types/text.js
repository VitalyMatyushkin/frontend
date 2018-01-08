const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		TextInput	= require('module/ui/text_input'),
		React 		= require('react'),
		Morearty	= require('morearty');

const TypeText =  React.createClass({
	propTypes: {
		textType: 		React.PropTypes.string,
		id:				React.PropTypes.string 		// just old good html id
	},
	mixins: [Morearty.Mixin, TypeMixin],
	componentWillMount: function() {
		const binding = this.getDefaultBinding();
		// For case when form filled async
		binding.addListener('defaultValue', () => {
			this.fullValidate(binding.get('defaultValue'));
		});
	},
	handleBlur: function(value) {
		this.setValue(value);
	},
	handleChange: function(value) {
		this.changeValue(value);
	},
	render: function () {
		const value	= String(this.getDefaultBinding().get('value'));

		// Use wrapper for input component because
		// input component with Morearty state has incorrect behaviour - cursor jump to end while user type text
		return (
			<TextInput
				id				= {this.props.id}
				textType		= {this.props.textType}
				value			= {value}
				placeholder		= {this.props.placeholder}
				disabled		= {this.props.isDisabled}
				onBlur			= {this.handleBlur}
				onFocus			= {() => {}}
				handleChange	= {this.handleChange}
			/>
		);
	}
});


module.exports = TypeText;