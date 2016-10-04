const Immutable   = require('immutable');

function create(binding) {
	return (text, okButtonText, cancelButtonText, handleClickOkButton, handleClickCancelButton) => {
		binding.atomically()
			.set('isOpen',					true)
			.set('text',					Immutable.fromJS(text))
			.set('okButtonText',			Immutable.fromJS(okButtonText))
			.set('cancelButtonText',		Immutable.fromJS(cancelButtonText))
			.set('handleClickOkButton',		Immutable.fromJS(handleClickOkButton))
			.set('handleClickCancelButton',	Immutable.fromJS(handleClickCancelButton))
			.commit();
	};
}

const ConfirmAlertFactory = {
	create: create
};

module.exports = ConfirmAlertFactory;