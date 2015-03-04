var Panel = require('./panel'),
    CalendarView = require('module/ui/calendar/calendar'),
    EventManagerBase = require('./event_manager_base'),
    EventManager;

EventManager = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			newEvent: {
				model: {
					rivalsType: 'schools'
				},
				inviteModel: {},
                step: 1
			}
		});
	},
    onSelectDate: function (date) {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('newEvent.model.startDate', date);
        binding.set('newEvent.step', 2);
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            step = binding.get('newEvent.step'),
            activeSchoolId = rootBinding.get('activeSchoolId'),
            titles = [
                'Step 1: Choose Date',
                'Step 2: Basic Info'
            ];

		return <div className="bEvents">
			<Panel binding={binding} />
            {titles[step - 1]}
            <div className="bManager">
                {step === 1 ? <CalendarView
                    binding={rootBinding.sub('events.calendar')}
                    onSelect={self.onSelectDate} /> : null}
                {step === 2 ? <EventManagerBase binding={binding} /> : null}
            </div>
		</div>;
	}
});


module.exports = EventManager;
