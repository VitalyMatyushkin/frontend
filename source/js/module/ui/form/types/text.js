const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
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
	componentDidUpdate: function () {
		if(this.cursor >= 0){
			this.refs.input.setSelectionRange(this.cursor, this.cursor);
		}
	},
	handleBlur: function(event) {
		this.cursor = -1;	//it is necessary to block the installation of the cursor after a loss of focus.
		this.setValue(event.target.value);
	},
	handleChange: function(event) {
		this.cursor = event.target.selectionStart;
		this.changeValue(event.target.value);
	},
	render: function () {
		const value	= this.getDefaultBinding().get('value');

		return (
			<input
				autoComplete="new-password"
				autoCapitalize="none"
				id={this.props.id}
				ref="input"
				value={value}
				type={this.props.textType || 'text'}
				placeholder={this.props.placeholder}
				onBlur={this.handleBlur}
				onFocus={() => {}}
				disabled={!!this.props.isDisabled}
				onChange={this.handleChange} />
		)
	}
});


module.exports = TypeText;