var Panel = require('./panel'),
	NewEvents,
	SVG = require('module/ui/svg'),
    ChooseTypeView = require('./steps/choose_type');

NewEvents = React.createClass({
    mixins: [Morearty.Mixin],
    getMergeStrategy: function () {
        return Morearty.MergeStrategy.OVERWRITE;
    },
    getDefaultState: function () {
        return Immutable.fromJS({
            newEvent: {
                model: {
                    rivalsType: 'schools'
                },
                inviteModel: {},
                step: 'chooseType'
            }
        });
    },
    nextStep: function () {
        var self = this;
    },
    render: function() {
		var self = this,
            steps = ['chooseType', 'chooseDate', 'chooseSport', 'searchRivals', 'team'],
            binding = self.getDefaultBinding(),
            step = binding.get('newEvent.step'),
            views = {
                chooseType: {
                    title: 'Step 1: Basic information',
                    view: ChooseTypeView
                }
            },
            title = views[step].title || '',
            CurrentView = views[step].view;

		return <div className="bEvents">
            <Panel binding={binding} />
            <h2>{title}</h2>
            <div className="eEvents_new">
                <CurrentView binding={binding.sub('newEvent')} />
            </div>
            <span className="bButton mRight mNext">Next</span>
        </div>
	}
});


module.exports = NewEvents;
