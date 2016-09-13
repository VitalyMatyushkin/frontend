const   classNames      = require('classnames'),
        React           = require('react'),
        SVG             = require('module/ui/svg'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
        Morearty		= require('morearty'),
        Sport           = require('module/ui/icons/sport_icon');

const InviteView = React.createClass({
    mixins: [Morearty.Mixin],
	// ID of current school
	// Will set on componentWillMount event
	activeSchoolId: undefined,
	propTypes: {
		type: React.PropTypes.oneOf(['inbox', 'outbox'])
	},
	componentWillMount: function() {
		const self = this;

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);
	},
    getParticipantEmblem:function(participant){
        if(participant !== undefined){
            return {backgroundImage: 'url(' + participant.pic + ')'};
        }
    },
    getSportIcon:function(sport){
        return <Sport name={sport} className="bIcon_invites" ></Sport>;
    },
    getGenderIcon:function(gender){
		var icon;
		console.log('gender: ' + gender);
		switch (true){
			case gender === 'FEMALE_ONLY':
				icon = <SVG classes="bIcon_invites" icon="icon_woman"></SVG>;
				break;
			case gender === 'MALE_ONLY':
				icon = <SVG classes="bIcon_invites" icon="icon_man"></SVG>;
				break;
			case gender === 'MIXED':
				icon = [
					<SVG classes="bIcon_invites" icon="icon_man"></SVG>,
					<SVG classes="bIcon_invites" icon="icon_woman"></SVG>
				];
				break;
			default:
				icon = <SVG classes="bIcon_invites" icon="icon_man"></SVG>;
				break;
		}
		return icon;
    },
    addZeroToFirst: function (num) {
        return String(num).length === 1 ? '0' + num : num;
    },
    _getAges: function (data) {
        var result = '';

        if (data !== undefined) {
            result = data.map(function (elem) {
                return 'Y' + elem;
            }).join(";");
        }

        return result;
    },
    render: function() {
        const   self            = this,
                binding         = self.getDefaultBinding(),
                inviterSchool   = binding.toJS('inviterSchool'),
                invitedSchool   = binding.toJS('invitedSchool'),
                rival           = invitedSchool.id === self.activeSchoolId ? inviterSchool : invitedSchool,
                inviteClasses   = classNames({
                    bInvite: true,
                    mNotRedeemed: !binding.get('redeemed')
                }),
                isInbox         = self.props.type === 'inbox',
                isOutBox        = self.props.type === 'outbox',
                isArchive       = binding.get('status') !== "NOT_READY",
                schoolPicture   = self.getParticipantEmblem(rival),
                sport           = self.getSportIcon(binding.get('sport.name')),
                ages            = binding.get('event.ages'),
                gender          = self.getGenderIcon(binding.get('event.gender')),
                message         = binding.get('message') || '',
                accepted        = binding.get('status') === 'ACCEPTED',
                eventDate       = (new Date(binding.get('event.startTime'))),
                startDate       = eventDate.toLocaleDateString(),
                hours           = self.addZeroToFirst(eventDate.getHours()),
                minutes         = self.addZeroToFirst(eventDate.getMinutes());

        let status;

        switch (true) {
            case isArchive && accepted:
            	status = 'Accepted';
				break;
			case isArchive && !accepted:
				status = 'Refused';
				break;
			default:
				status = '';
        }

        return (
        <div className={inviteClasses}>
            <div className="eInvite_img" style={schoolPicture}></div>
            <div className="eInviteWrap">
                <div className="eInvite_header">
                    <span className="eInvite_eventName">
                        {rival.name}
                    </span>
                    <div className="eInviteSport">{sport}</div>
                </div>
                <div className="eInvite_info">
                    <div className="eInvite_gender">{gender}</div>
                    <div>{'Start date:'} {startDate}</div>
                    <div>{'Time:'} {hours + ':' + minutes}</div>
                    <div>{'Year Group:'} {self._getAges(ages)}</div>
                </div>
                <div className="eInvite_footer">
                    <div className="eInvite_message">
                        {isOutBox ? 'Awaiting opponent...' : null}
                        {isArchive ? <span className={'m'+status}>{status}</span>: null}
                    </div>
                    <div className="eInvite_buttons">
                        {isInbox ?
                            <a href={'/#invites/' + binding.get('id') + '/accept'} className="bButton">Accept</a> : null}
                        {isInbox ? <a href={'/#invites/' + binding.get('id') + '/decline'}
                                      className="bButton mRed">Decline</a> : null}
                        {isOutBox ? <a href={'/#invites/' + binding.get('id') + '/cancel'}
                                       className="bButton mRed">Cancel</a> : null}
                    </div>
                </div>
            </div>
        </div>
        );
    }
});


module.exports = InviteView;
