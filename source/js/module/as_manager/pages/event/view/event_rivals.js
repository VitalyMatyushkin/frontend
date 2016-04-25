const 	If 				= require('module/ui/if/if'),
		InvitesMixin 	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		EventHelper		= require('module/helpers/eventHelper'),
		React			= require('react');

const EventRival = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	getPic: function (order) {
		const	self = this,
				binding = self.getDefaultBinding(),
				eventType = binding.get('model.eventType'),
				participant = binding.sub(['participants', order]);
		let		pic = null;

		switch (eventType) {
			case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				if(order === 0) {
					pic = binding.get('invites.inviterSchool.pic');
				} else if(order === 1) {
					pic = binding.get('invites.invitedSchool.pic');
				}
				break;
			case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				pic = participant.get('house.pic');
				break;
		};

		return (
			eventType !== EventHelper.clientEventTypeToServerClientTypeMapping['internal'] ?
				<img	className="eEventRivals_pic"
						src={pic}
						alt={participant.get('name')}
						title={participant.get('name')}
				/>
				: null
		);
	},
	getName: function (order) {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				eventType	= binding.get('model.eventType'),
				participant	= binding.sub(['participants', order]);
		let		name		= null;

		switch (eventType) {
			case EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']:
				if(order === 0) {
					name = binding.get('invites.inviterSchool.name');
				} else if(order === 1) {
					name = binding.get('invites.invitedSchool.name');
				}
				break;
			case EventHelper.clientEventTypeToServerClientTypeMapping['houses']:
				name = participant.get('house.name');
				break;
			case EventHelper.clientEventTypeToServerClientTypeMapping['internal']:
				name = participant.get('name');
				break;
		}

		return name;
	},
    getCountPoint: function (order) {
        var self = this,
            binding = self.getDefaultBinding(),
            pointsBinding = binding.get('model.result.points') || binding.get('points'),
            teamId = binding.get('participants.' + order + '.id');

        return pointsBinding.filter(function (point) {
            return point.get('teamId') === teamId;
        }).count();
    },
	render: function() {
        var self = this,
			binding = self.getDefaultBinding(),
			rivals = binding.get('rivals');

		return <div className="bEventRivals">
			<div className="bEventRival">
				<div className="eEventRival_rival">{self.getPic(0)}</div>
				<div className="eEventRival_name" title={self.getName(0)}>{self.getName(0)}</div>
			</div>
			<div className="bEventResult">
                <If condition={binding.get('model.status') === "NOT_FINISHED" && binding.get('mode') !== 'closing'}>
					<div className="eEventResult_score">
						<span>Score</span>
						<div className="eEventResult_point">
							<span>-</span>
							<span> : </span>
							<span>-</span>
						</div>
					</div>
                </If>
                <If condition={binding.get('model.status') === "FINISHED" || binding.get('mode') === 'closing'}>
					<div className="eEventResult_score">
						<span>Score</span>
						<div className="eEventResult_point">
							<span>{self.getCountPoint(0)}</span>
							<span> : </span>
							<span>{self.getCountPoint(1)}</span>
						</div>
					</div>
                </If>
            </div>
			<div className="bEventRival">
				<div className="eEventRival_rival">{self.getPic(1)}</div>
				<div className="eEventRival_name" title={self.getName(1)}>{self.getName(1)}</div>
			</div>
        </div>;
	}
});


module.exports = EventRival;
