/**
 * Created by vitaly on 17.11.17.
 */

const Immutable = require('immutable');

function create(binding: any) {
	
	return (webIntroEnabled, webIntroShowTimes) => {
		binding.atomically()
			.set('isOpen', true)
			.set('wasOpened', true)
			.set('webIntroEnabled', Immutable.fromJS(webIntroEnabled))
			.set('webIntroShowTimes', Immutable.fromJS(webIntroShowTimes))
			.commit();
	};
}

module.exports.create = create;