/**
 * Created by vitaly on 16.10.17.
 */
const 	TypeMixin 		= require('module/ui/form/types/type_mixin'),
		CurrencyInput	= require('module/ui/currency_input'),
		React 			= require('react'),
		Morearty		= require('morearty');

const TypeCurrency =  React.createClass({
	propTypes: {
		currencySymbol:	React.PropTypes.string,
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
		const value	= this.getDefaultBinding().get('value');

		return (
			<CurrencyInput
				id				= {this.props.id}
				textType		= {this.props.textType}
				value			= {value}
				placeholder		= {this.props.placeholder}
				currencySymbol  = {this.props.currencySymbol}
				disabled		= {this.props.isDisabled}
				onBlur			= {this.handleBlur}
				onFocus			= {() => {}}
				handleChange	= {this.handleChange}
			/>
		);
	}
});


module.exports = TypeCurrency;