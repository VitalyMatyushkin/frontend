const 	InvitesMixin 	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		React 			= require('react'),
		SVG         = require('module/ui/svg');

const EventHeader = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	getSportIcon:function(sport){
		if(sport !== undefined){
			var icon;
			switch (sport){
				case 'football':
					icon = <SVG classes="bIcon_mSport" icon="icon_ball"></SVG>;
					break;
				case 'rounders':
					icon = <SVG classes="bIcon_mSport" icon="icon_rounders"></SVG>;
					break;
				case 'rugby':
					icon = <SVG classes="bIcon_mSport" icon="icon_rugby"></SVG>;
					break;
				case 'hockey':
					icon = <SVG classes="bIcon_mSport" icon="icon_hockey"></SVG>;
					break;
				case 'cricket':
					icon = <SVG classes="bIcon_mSport" icon="icon_cricket"></SVG>;
					break;
				case 'netball':
					icon = <SVG classes="bIcon_mSport" icon="icon_netball"></SVG>;
					break;
				default:
					icon = <SVG classes="bIcon_mSport" icon="icon_rounders"></SVG>;
					break;
			}
			return icon;
		}
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
