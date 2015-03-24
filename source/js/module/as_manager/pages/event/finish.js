var EventHeader = require('./view/event_header'),
	EventTeams = require('./view/event_teams'),
    If = require('module/ui/if/if'),
    EventGeneralView;

EventGeneralView = React.createClass({
	mixins: [Morearty.Mixin],
    closeMatch: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            points = binding.toJS('points'),
            event = binding.toJS('model');

        window.Server.results.post({
            eventId: event.id
        }).then(function (result) {
            points.forEach(function (point) {
                point.resultId = result.id;

                window.Server.pointsInResult.post({resultId: result.id}, point).then(function (res) {
                    console.log(res);
                });
            });

            delete event.participants;
            delete event.result;
            delete event.invites;

            event.resultId = result.id;

            window.Server.event.put({
                eventId: event.id
            }, event).then(function (res) {
                binding.set('model.resultId', result.id);
            });
        });
    },
    getCountPoint: function (order) {
        var self = this,
            binding = self.getDefaultBinding(),
            participantId = binding.get('participants.' + order + '.id');

        return binding.get('points').filter(function (point) {
            return point.get('participantId') === participantId;
        }).count();
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			rootBinding = self.getMoreartyContext().getBinding();

		return <div className="bEvent">
            <div className="eEventContainer_buttons">
                <If condition={binding.get('participants').count() > 1 && !binding.get('model.resultId')}>
                    <span className="bButton" onClick={self.closeMatch}>close</span>
                </If>
                <If condition={binding.get('participants').count() < 2 && !binding.get('model.resultId')}>
                    <span className="bButton mRed">oponnent waiting...</span>
                </If>
                <If condition={binding.get('resultId')}>
                    <span className="bButton mDisable">closed</span>
                </If>
            </div>
            <div className="eEvent_points">
                <span>{self.getCountPoint(0)}</span>
                <span>{self.getCountPoint(1)}</span>
            </div>
			<EventHeader binding={binding} />
			<EventTeams binding={binding} />
		</div>;
	}
});


module.exports = EventGeneralView;
