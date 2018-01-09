import * as Immutable from 'immutable';

export const SimpleAlertFactory = {
	create(binding) {
		const noOp = () => {};
		/**
		 * text - alert text
		 * okButtonText - text for ok button
		 * handleClickOkButton - handler for click to ok button event
		 */
		return (text, okButtonText = 'Ok', handleClickOkButton = noOp) => {
			binding.atomically()
				.set('isOpen',					true)
				.set('text',					Immutable.fromJS(text))
				.set('okButtonText',			Immutable.fromJS(okButtonText))
				.set('handleClickOkButton',		Immutable.fromJS(handleClickOkButton))
				.commit();
		};
	}
};