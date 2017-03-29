// @flow

const Immutable = require('immutable');

function create(binding: any) {

	const noOp = () => {};
	/**
	 * text - alert text
	 * okButtonText - text for ok button
	 * handleClickOkButton - handler for click to ok button event
	 */
	return (text: string, okButtonText: ?string = 'Ok', handleClickOkButton: ?() => void = noOp) => {
		binding.atomically()
			.set('isOpen',					true)
			.set('text',					Immutable.fromJS(text))
			.set('okButtonText',			Immutable.fromJS(okButtonText))
			.set('handleClickOkButton',		Immutable.fromJS(handleClickOkButton))
			.commit();
	};
}

module.exports.create = create;