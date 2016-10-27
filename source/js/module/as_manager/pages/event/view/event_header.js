const 	DateHelper 		= require('module/helpers/date_helper'),
		Morearty		= require('morearty'),
		React 			= require('react'),

		If				= require('module/ui/if/if'),
		EventButtons	= require('./event_buttons');

const EventHeader = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding(),
				date = binding.toJS('model.startTime'),
				eventDate = DateHelper.getDate(date),
				time = DateHelper.getTime(date);
		return (
				<div className="bEventHeader">
					<div className="bEventHeader_leftSide">
						<div className="eEventHeader_field mEvent">{binding.get('model.name')}</div>
						<div className="eEventHeader_field mDate">{eventDate + ' ' + time}</div>
					</div>
					<div className="bEventHeader_rightSide">
						<If condition={(binding.get('mode') === 'general')}>
							<EventButtons binding={binding} />
						</If>
					</div>
				</div>
		);
	}
});


module.exports = EventHeader;
