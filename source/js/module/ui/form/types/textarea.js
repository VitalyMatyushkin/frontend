/**
 * Created by bridark on 04/08/15.
 */
const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		Morearty 	= require('morearty'),
		React 		= require('react');

const TypeTextArea = React.createClass({
	propTypes: {
		textType: React.PropTypes.string
	},
	mixins: [Morearty.Mixin, TypeMixin],
	
	//when we change value in textarea, component rerender and reset current position scroll and cursor,
	//so we store current scroll and cursor position and prevent reset
	componentWillMount: function() {
		const binding = this.getDefaultBinding();

		// На случай, если форма заполняется асинхронно
		binding.addListener('defaultValue', () => {
			this.forceNewValue(binding.get('defaultValue'));
		});
		this.scrollPosition = 0;
	},
	componentDidUpdate: function () {

		if(this.cursorPosition >= 0){
			this.refs.fieldInput.setSelectionRange(this.cursorPosition, this.cursorPosition);
		}
	},
	forceNewValue: function(value) {

		if (value !== undefined && this.refs.fieldInput && this.refs.fieldInput.value === '') {
			this.refs.fieldInput.value = value;
			this.fullValidate(value);
		}
	},
	handleBlur: function() {

		this.cursorPosition = -1;	//it is necessary to block the installation of the cursor after a loss of focus.
		this.setValue(this.refs.fieldInput.value);
	},
	handleChange: function(event) {

		this.cursorPosition = event.target.selectionStart;
		this.scrollPosition = this.refs.fieldInput.scrollTop;
		this.changeValue(this.refs.fieldInput.value);
	},
	render: function () {
		const 	defaultValue	= this.getDefaultBinding().get('defaultValue'),
				value			= this.getDefaultBinding().get('value');
		if (typeof this.refs.fieldInput !== 'undefined') {
			this.refs.fieldInput.scrollTop = this.scrollPosition;
		}
		return (
			<textarea	ref			= "fieldInput"
						value		= { value }
						type		= { this.props.textType || 'textarea' }
						placeholder	= { this.props.placeholder }
						onBlur		= { this.handleBlur }
						onChange	= { this.handleChange }
			>
			</textarea>
		)
	}
});

module.exports = TypeTextArea;