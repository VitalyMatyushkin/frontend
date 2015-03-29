var EventRival,
    If = require('module/ui/if/if'),
    InvitesMixin = require('module/as_manager/pages/invites/mixins/invites_mixin');

EventRival = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	getPic: function (order) {
		var self = this,
			binding = self.getDefaultBinding(),
			type = binding.get('model.type'),
			participant = binding.sub(['participants', order]),
			pic = null;

		if (type === 'inter-schools') {
			pic = participant.get('school.pic') || binding.get('invites.0.guest.pic');
		} else if (type === 'houses') {
			pic = participant.get('house.pic');
		}

		return <img className="eEventRivals_pic"
			src={pic}
			alt={participant.get('name')}
			title={participant.get('name')} />;
	},
	getName: function (order) {
		var self = this,
			binding = self.getDefaultBinding(),
			type = binding.get('model.type'),
			participant = binding.sub(['participants', order]),
			name = null;

		if (type === 'inter-schools') {
			name = participant.get('school.name') || binding.get('invites.0.guest.name');
		} else if (type === 'houses') {
			name = participant.get('house.name');
		} else {
			name = participant.get('name');
		}

		return name;
	},
    getCountPoint: function (order) {
        var self = this,
            binding = self.getDefaultBinding(),
            pointsBinding = binding.get('model.resultId') ? binding.sub('model.result.points') : binding.sub('points'),
            participantId = binding.get('participants.' + order + '.id');

        return pointsBinding.get().filter(function (point) {
            return point.get('participantId') === participantId;
        }).count();
    },
	render: function() {
        var self = this,
			binding = self.getDefaultBinding(),
			rivals = binding.get('rivals'),
            time = new Date(binding.get('model.startTime')),
            hours = self.zeroFill(time.getHours()),
            minutes = self.zeroFill(time.getMinutes());

		return <div className="bEventRivals">
			<div className="bEventRival">
				<div className="eEventRival_rival">{self.getPic(0)}</div>
				<div className="eEventRival_name">{self.getName(0)}</div>
			</div>
			<div className="bEventResult">
                <If condition={!binding.get('model.resultId') && binding.get('mode') !== 'closing'}>
                    <div className="eEventResult_time">{[hours, minutes].join(':')}</div>
                </If>
                <If condition={!!binding.get('model.resultId') || binding.get('mode') === 'closing'}>
                    <div className="eEventResult_score">
                        <span>{self.getCountPoint(0)}</span>
                        <span>:</span>
                        <span>{self.getCountPoint(1)}</span>
                    </div>
                </If>
                <div className="eEventResult_vs">V</div>
            </div>
			<div className="bEventRival">
				<div className="eEventRival_rival">{self.getPic(1)}</div>
				<div className="eEventRival_name">{self.getName(1)}</div>
			</div>
        </div>;
	}
});


module.exports = EventRival;
