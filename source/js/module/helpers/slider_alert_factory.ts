import * as Immutable from 'immutable';

export const SliderAlertFactory = {
	create(binding) {
		return (webIntroEnabled, webIntroShowTimes) => {
			binding.atomically()
				.set('isOpen', true)
				.set('wasOpened', true)
				.set('webIntroEnabled', Immutable.fromJS(webIntroEnabled))
				.set('webIntroShowTimes', Immutable.fromJS(webIntroShowTimes))
				.commit();
		};
	}
};