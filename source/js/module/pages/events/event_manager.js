var Panel = require('./panel'),
    CalendarView = require('module/ui/calendar/calendar'),
    EventManagerBase = require('./event_manager_base'),
    Manager = require('module/ui/managers/manager'),
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
                step: 1,
                players: [],
				teams: {
					first: {},
					second: {}
				}
			}
		});
	},
    onSelectDate: function (date) {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('newEvent.model.startDate', date);
        binding.set('newEvent.step', 2);
    },
	toNext: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			step = binding.get('newEvent.step');

		self.getDefaultBinding().set('newEvent.step', step + 1);
	},
	toBack: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			step = binding.get('newEvent.step');

		self.getDefaultBinding().set('newEvent.step', step - 1);
	},
	toFinish: function () {
		console.log('finish')
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            step = binding.get('newEvent.step'),
            activeSchoolId = rootBinding.get('activeSchoolId'),
            titles = [
                'Choose Date',
                'Basic Info',
				'Form teams'
            ],
			bManagerClasses = classNames({
				bManager: true,
				mDate: step === 1,
				mBase: step === 2,
				mTeamManager: step === 3
			});

		return <div className="bEvents">
			<Panel binding={binding} />
           	<h3>{'[' + step + '/' + titles.length + ']: ' + titles[step - 1]}</h3>
            <div className={bManagerClasses}>
                {step === 1 ? <CalendarView
                    binding={rootBinding.sub('events.calendar')}
                    onSelect={self.onSelectDate} /> : null}
                {step === 2 ? <EventManagerBase binding={binding} /> : null}
                {step === 3 ? <Manager binding={binding} /> : null}
            </div>
			<div className="eEvents_buttons">
				{step > 1 ? <span className="bButton eEvents_button" onClick={self.toBack}>Back</span> : null}
				{step < titles.length ? <span className="bButton eEvents_button" onClick={self.toNext}>Next</span> : null}
				{step === titles.length ? <span className="bButton eEvents_button mFinish" onClick={self.toFinish}>Finish</span> : null}
			</div>
		</div>;
	}
});


module.exports = EventManager;
