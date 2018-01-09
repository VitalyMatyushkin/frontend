/**
 * Created by vitaly on 12.09.17.
 */
const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		NumberInput	= require('module/ui/number_input'),
		React 		= require('react'),
		Morearty	= require('morearty');

const TypeText =  React.createClass({
	propTypes: {
		id:			React.PropTypes.string, 		// just old good html id
		isDisabled:	React.PropTypes.bool
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
		const value = typeof this.getDefaultBinding().get('value') !== 'undefined' ?
			String(this.getDefaultBinding().get('value')) :
			this.getDefaultBinding().get('value');

		// Use wrapper for input component because
		// input component with Morearty state has incorrect behaviour - cursor jump to end while user type text
		return (
			<NumberInput
				id				= {this.props.id}
				value			= {value}
				placeholder		= {this.props.placeholder}
				isDisabled		= {this.props.isDisabled}
				onBlur			= {this.handleBlur}
				onFocus			= {() => {}}
				handleChange	= {this.handleChange}
			/>
		);
	}
});


module.exports = TypeText;