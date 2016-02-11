const 	InvitesMixin 	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		React 			= require('react');

const EventHeader = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	render: function() {
        const 	self 	= this,
				binding = self.getDefaultBinding();
		return (
				<div className="bEventHeader">
					<div className="eEventHeader_field mSport">{binding.get('sport.name')}</div>
					<div className="eEventHeader_field_wrap">
						<div className="eEventHeader_field mDate">{self.formatDate(binding.get('model.startTime'))}</div>
						<div className="eEventHeader_field mType">{binding.get('model.type')}</div>
					</div>
				</div>
		);
	}
});


module.exports = EventHeader;
