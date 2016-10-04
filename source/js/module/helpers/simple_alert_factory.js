const Immutable = require('immutable');

function create(binding) {
	return (text, okButtonText, handleClickOkButton) => {
		binding.atomically()
			.set('isOpen',					true)
			.set('text',					Immutable.fromJS(text))
			.set('okButtonText',			Immutable.fromJS(okButtonText))
			.set('handleClickOkButton',		Immutable.fromJS(handleClickOkButton))
			.commit();
	};
}

const SimpleAlertFactory = {
	create: create
};

module.exports = SimpleAlertFactory;