var EventRival;

EventRival = React.createClass({
	mixins: [Morearty.Mixin],
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
	render: function() {
        var self = this,
			binding = self.getDefaultBinding(),
			rivals = binding.get('rivals');

		return <div className="bEventRivals">
			<div className="bEventRival">
				<div className="eEventRival_rival">{self.getPic(0)}</div>
				<div className="eEventRival_name">{self.getName(0)}</div>
			</div>
			<div className="bEventResult">VS</div>
			<div className="bEventRival">
				<div className="eEventRival_rival">{self.getPic(1)}</div>
				<div className="eEventRival_name">{self.getName(1)}</div>
			</div>
        </div>;
	}
});


module.exports = EventRival;
