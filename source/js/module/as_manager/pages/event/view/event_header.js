const 	InvitesMixin 	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		React 			= require('react'),
        Sport           = require('module/ui/icons/sport_icon');

const EventHeader = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	getSportIcon:function(sport){
        return <Sport name={sport} className="bIcon_mSport" ></Sport>;
	},
	render: function() {
        const 	self 	= this,
				binding = self.getDefaultBinding();
		return (
				<div className="bEventHeader">
					<div className="eEventHeader_field mSport">{self.getSportIcon(binding.get('sport.name'))}</div>
					<div className="eEventHeader_field_wrap">
						<div className="eEventHeader_field mDate">{self.formatDate(binding.get('model.startTime'))}</div>
						<div className="eEventHeader_field mEvent">{binding.get('model.name')}</div>
						<div className="eEventHeader_field mType">{binding.get('model.type')}</div>
					</div>
				</div>
		);
	}
});


module.exports = EventHeader;
