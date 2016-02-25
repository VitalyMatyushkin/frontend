const 	TypeMixin 	= require('module/ui/form/types/type_mixin'),
		React 		= require('react');

const TypeText =  React.createClass({
	propTypes: {
		htmlId: 		React.PropTypes.string,
		textType: 		React.PropTypes.string,
        ignoreOnBlur: 	React.PropTypes.bool,
		promptOnBlank:	React.PropTypes.bool //This proptype ignores deep validation and prompts user of empty dialogue
	},
	mixins: [Morearty.Mixin, TypeMixin],
	componentWillMount: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding();

		// На случай, если форма заполняется асинхронно
		// HOLY GUACAMOLE!!!
		binding.addListener('defaultValue', function() {
			self._forceNewValue(binding.get('defaultValue'));
		});
	},
	/** looks like this function used for setting default value when input is empty */
	_forceNewValue: function(value) {
		const self = this;
		/* if there is both `value` and `fieldInput` ref */
		if (value !== undefined && self.refs.fieldInput && self.refs.fieldInput.value === '') {
			self.refs.fieldInput.value = value;
			self.fullValidate(value);
		}
	},
	handleBlur: function(event) {
		this.setValue(event.target.value);
	},
	handleChange: function(event) {
		this.changeValue(event.target.value);
	},
	render: function () {
		const 	self 			= this,
				defaultValue 	= self.getDefaultBinding().get('defaultValue');

        if(!('ignoreOnBlur' in self.props) || (self.props.ignoreOnBlur === false)){
            if (typeof self.props.defaultValueString === 'undefined') {
				/*
				* Check if current instance of text input allows validation against empty input before
				* forcing new value into the dialogue box
				* */
				if(!self.props.promptOnBlank){
					self._forceNewValue(defaultValue);
				}
            } else {
                self._forceNewValue(self.props.defaultValueString);
            }
        }

		return (
			<div className="eForm_fieldInput">
				<input ref="fieldInput" type={self.props.textType || 'text'} placeholder={self.props.placeholder} id={self.props.htmlId} onBlur={self.handleBlur} onChange={self.handleChange} />
			</div>
		)
	}
});


module.exports = TypeText;