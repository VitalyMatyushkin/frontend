var InvitesMixin = require('../mixins/invites_mixin'),
    classNames = require('classnames'),
    React = require('react'),
    SVG = require('module/ui/svg'),

    InviteView;
InviteView = React.createClass({
    mixins: [Morearty.Mixin, InvitesMixin],
	propTypes: {
		type: React.PropTypes.oneOf(['inbox', 'outbox'])
	},
	onClickCancel: function () {
		var self = this,
			binding = self.getDefaultBinding();

		binding
			.set('redeemed', true)
			.set('accepted', false);

		window.Server.invite.put({
			inviteId: binding.get('id')
		}, binding.toJS());
	},
    onClickRedeemed: function () {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('redeemed', true);

		window.Server.invite.put({
			inviteId: binding.get('id')
		}, binding.toJS());
	},
    getParticipantEmblem:function(participant){
        if(participant !== undefined){
            return {backgroundImage: 'url(' + participant.pic + ')'};
        }
    },
    getSportIcon:function(sport){
        if(sport !== undefined){
            var icon;
            switch (sport){
                case 'football':
                    icon = <SVG classes="bIcon_invites" icon="icon_ball"></SVG>;
                    break;
                case 'rounders':
                    icon = <SVG classes="bIcon_invites" icon="icon_rounders"></SVG>;
                    break;
                case 'rugby':
                    icon = <SVG classes="bIcon_invites" icon="icon_rugby"></SVG>;
                    break;
                case 'hockey':
                    icon = <SVG classes="bIcon_invites" icon="icon_hockey"></SVG>;
                    break;
                case 'cricket':
                    icon = <SVG classes="bIcon_invites" icon="icon_cricket"></SVG>;
                    break;
                case 'netball':
                    icon = <SVG classes="bIcon_invites" icon="icon_netball"></SVG>;
                    break;
                default:
                    icon = <SVG classes="bIcon_invites" icon="icon_rounders"></SVG>;
                    break;
            }
            return icon;
        }
    },
    getGenderIcon:function(gender){
        if(gender !== undefined){
            var icon;
            switch (gender){
                case 'female':
                    icon = <SVG classes="bIcon_invites" icon="icon_woman"></SVG>;
                    break;
                default:
                    icon = <SVG classes="bIcon_invites" icon="icon_man"></SVG>;
                    break;
            }
            return icon;
        }
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = globalBinding.get('userRules.activeSchoolId'),
            inviter = binding.toJS('inviter'),
            guest = binding.toJS('guest'),
            rival = guest.id === activeSchoolId ? inviter : guest,
            inviteClasses = classNames({
                bInvite: true,
                mNotRedeemed: !binding.get('redeemed')
            }),
			isInbox = self.props.type === 'inbox',
			isOutBox = self.props.type === 'outbox',
			isArchive = typeof binding.get('accepted') === 'boolean',
            schoolPicture = self.getParticipantEmblem(rival),
            sport = self.getSportIcon(binding.get('event.sport.name')),
            ages = binding.get('event.ages'),
            gender = self.getGenderIcon(binding.get('event.gender')),
            message = binding.get('message') || '',
            isRedeemed = binding.get('redeemed'),
            startDate = (new Date(binding.get('event.startTime'))).toLocaleDateString(),
            startTime = (new Date(binding.get('event.startTime'))).toLocaleTimeString();

        return <div key={binding.get('id')} className={inviteClasses}>
            <div className="eInvite_img" style={schoolPicture}></div>
            <div className="eInviteWrap">
                <div className="eInvite_header">
                    <span className="eInvite_eventName">
                        {rival.name}
                    </span>
                    <div className="eInviteSport">{sport}</div>
                </div>
                <span className="eInvite_eventDate"></span>
                <div className="eInvite_info">
                    <div className="eInvite_gender">{gender}</div>
                    <div>{'Start date:'} {startDate}</div>
                    <div>{'Time:'} {startTime}</div>
                    <div>{'Age:'} {ages}</div>
                </div>
                <div className="eInvite_footer">
                {isOutBox ? <div
                    className="eInvite_message">{isInbox || isArchive ? message : 'Awaiting opponent...' }</div> : null}
                <div className="eInvite_buttons">
                    {isInbox ?
                        <a href={'/#invites/' + binding.get('id') + '/accept'} className="bButton">Accept</a> : null}
                    {isInbox ? <a href={'/#invites/' + binding.get('id') + '/decline'}
                                  className="bButton mRed">Decline</a> : null}
                    {isOutBox ? <a href={'/#invites/' + binding.get('id') + '/cancel'}
                                   className="bButton mRed">Cancel</a> : null}
                    {isArchive ? <a href={'/#invites/' + binding.get('id') + '/cancel'}
                                   className="bButton mRed">Cancel</a> : null}
                </div></div>
            </div>
            {!isRedeemed && isInbox ?
                <span className="eInvite_redeemed" onClick={self.onClickRedeemed}>{'was read?'}</span> : null}
        </div>;
    }
});


module.exports = InviteView;
