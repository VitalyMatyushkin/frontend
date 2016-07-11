const 	InvitesMixin 	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		DateTimeMixin 	= require('module/mixins/datetime'),
		React 			= require('react');

const EventHeader = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	getSportIcon:function(sport){
		return <Sport name={sport} className="bIcon_mSport" ></Sport>;
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding(),
				date = new Date(binding.get('model.startTime')),
				eventDate = self.zeroFill(date.getDate()) + '/' + self.zeroFill(date.getMonth()) + '/' + date.getFullYear(),
				time = self.zeroFill(date.getHours()) + ':' + self.zeroFill(date.getMinutes());
		return (
				<div className="bEventHeader">
					<div className="eEventHeader_field mEvent">{binding.get('model.name')}</div>
					<div className="eEventHeader_field mDate">{eventDate + '\u0020' + time}</div>
				</div>
		);
	}
});


module.exports = EventHeader;
