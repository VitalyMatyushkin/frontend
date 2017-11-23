const BigScreenHelper = {
	getCurrentHighLightEvent: function (binding) {
		const currentIndex = binding.toJS('events.highlightEvents.currentIndex');

		return this.getEventDataByIndex(
			binding,
			currentIndex
		);
	},
	getEventDataByIndex: function (binding, index) {
		const events = binding.toJS('events.highlightEvents.events');
		const event = events[index];

		return event;
	}
};

module.exports = BigScreenHelper;
