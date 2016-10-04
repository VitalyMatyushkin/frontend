const Immutable   = require('immutable');

function create(binding) {
	/**
	 * text						- alert text
	 * okButtonText				- text for ok button
	 * cancelButtonText			- text for cancel button
	 * handleClickOkButton		- handler for click to ok button event
	 * handleClickCancelButton	- handler for click to cancel button event
	 */
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


module.exports.create = create;