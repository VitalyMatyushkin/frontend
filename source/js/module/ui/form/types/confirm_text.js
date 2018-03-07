const 	TypeText 	= require('module/ui/form/types/text'),
		React 		= require('react'),
		ReactDOM 	= require('react-dom'),
		Morearty	= require('morearty'),
		TypeMixin 	= require('module/ui/form/types/type_mixin'),
		errorText 	= 'Values in both fields do not match';

const TypeConfirmText = React.createClass({
	mixins: [Morearty.Mixin, TypeMixin],
	componentWillMount: function() {
		const binding = this.getDefaultBinding();

		binding.addListener('defaultValue', () => {
			const defaultValue = binding.get('defaultValue');

			defaultValue && this._forceNewValue(defaultValue);
		});
	},
	_forceNewValue: function(value) {
		if (ReactDOM.findDOMNode(this.refs.confInput) && value) {
			ReactDOM.findDOMNode(this.refs.confInput).value = value;
			this.confirmValue = value;
		}
	},
	onSetValue: function() {
        this.checkConfirm();
	},
	setConfirmValue: function(event) {
        this.confirmValue = event.currentTarget.value;
        this.checkConfirm();
	},
	checkConfirm: function() {
		const	binding	= this.getDefaultBinding(),
				error	= binding.get('error');

		// Проверку на совпадение полей делаем только в том случае, если нет других ошибок валидации
		if (!error || error === errorText) {
			binding.set('error', errorText);

			if (this.confirmValue && binding.get('value') === this.confirmValue) {
                binding.set('error', false);
				this.hideError();
			}
		}
	},
	render: function() {
		const confirmationInputHtmlId = this.props.id ? this.props.id + '_2' : undefined;
		return (
			<div className="eForm_confirmField">
				<div className="eForm_fieldColumn">
					<TypeText {...this.props} onSetValue={this.onSetValue} />
				</div>
				<br />
				<div className="eForm_fieldColumn">
					<div className="eForm_fieldName eForm_fieldSmallHelp">Confirm {this.props.name.toLowerCase()}</div>
					<div className="eForm_fieldInput">
						<input ref="confInput" type={this.props.textType || 'text'} onBlur={this.setConfirmValue} onChange={this.changeConfirmValue} id={confirmationInputHtmlId}/>
					</div>
				</div>
			</div>

		)
	}
});

module.exports = TypeConfirmText;
