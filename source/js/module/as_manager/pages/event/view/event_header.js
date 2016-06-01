const 	InvitesMixin 	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		React 			= require('react');

const EventHeader = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	getSportIcon:function(sport){
		return <Sport name={sport} className="bIcon_mSport" ></Sport>;
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
				<div className="bEventHeader">
					<div className="eEventHeader_field mEvent">{binding.get('model.name')}</div>
					<div className="eEventHeader_field mDate">{self.formatDate(binding.get('model.startTime'))}</div>
				</div>
		);
	}
});


module.exports = EventHeader;
