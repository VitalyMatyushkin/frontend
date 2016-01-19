const 	React 		= require('react'),
		Immutable 	= require('immutable'),
		typeList 	= require('module/ui/form/types/type_list');

const FormField = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		type: 				React.PropTypes.string.isRequired,
		field: 				React.PropTypes.string.isRequired,
		defaultValueString:	React.PropTypes.string
	},
	getDefaultState: function () {
		return Immutable.Map({
			value: '',
			showError: false,
			error: false
		});
	},
	render: function () {
		const 	self 	= this,
				binding = self.getDefaultBinding();
		let 	inputField 		= React.createElement(typeList[self.props.type], self.props),
				fieldStyleClass = 'eForm_fieldSet';

		// TODO: Emhh...
		inputField = React.cloneElement(inputField, {
			name: 		self.props.children,
			service: 	self.props.service,
			binding: 	self.getDefaultBinding()
		});

		if (binding.get('showError')) {
			fieldStyleClass += ' mInvalid';
		}else{
            if(binding.get('showSuccess')){
                fieldStyleClass += ' mValid';
            }
        }
		return (
			<div className="eForm_field">
				<div className="eForm_fieldName">{self.props.children}</div>
				<div className={fieldStyleClass}>
					{inputField}
					<div className="eForm_fieldValidText">{binding.get('error') || binding.get('success')}</div>
				</div>
			</div>

		)
	}
});

module.exports = FormField;
