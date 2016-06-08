const 	InvitesMixin 	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		React 			= require('react');

const EventHeader = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	getSportIcon:function(sport){
		return <Sport name={sport} className="bIcon_mSport" ></Sport>;
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding(),
				eventStartDate = new Date(binding.get('model.startTime')),
				eventDate = eventStartDate.toLocaleString();
		return (
				<div className="bEventHeader">
					<div className="eEventHeader_field mEvent">{binding.get('model.name')}</div>
					<div className="eEventHeader_field mDate">{eventDate}</div>
				</div>
		);
	}
});


module.exports = EventHeader;
