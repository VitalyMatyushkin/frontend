const   classNames      = require('classnames'),
		DateHelper		= require('./../../../../helpers/date_helper'),
        React           = require('react'),
        SVG             = require('module/ui/svg'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
        Morearty		= require('morearty'),
		Button			= require('module/ui/button/button'),
        SportIcon		= require('module/ui/icons/sport_icon'),
		Map 			= require('module/ui/map/map-event-venue'),
		GenderIcon		= require('module/ui/icons/gender_icon');

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
        return <SportIcon name={sport} className="bIcon_invites" />;
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
                gender          = <GenderIcon classes='bIcon_invites' gender={binding.get('event.gender')}/>,
                message         = binding.get('message') || '',
                accepted        = binding.get('status') === 'ACCEPTED',
                eventDate       = (new Date(binding.get('event.startTime'))),
                startDate       = DateHelper.getDateStringFromDateObject(eventDate),
                hours           = self.addZeroToFirst(eventDate.getHours()),
                minutes         = self.addZeroToFirst(eventDate.getMinutes()),
				inviteId		= binding.get('id'),
				venue 			= binding.toJS('event.venue'),
				venueArea 		= venue.postcodeId ? <Map binding={binding} venue={venue} />
													: <div>Venue to be defined</div>;

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
                <div className="eInvite_map">
			{venueArea}
                </div>
                <div className="eInvite_footer">
                    <div className="eInvite_message">
                        {isOutBox ? 'Awaiting opponent...' : null}
                        {isArchive ? <span className={'m'+status}>{status}</span>: null}
                    </div>
                    <div className="eInvite_buttons">
                        {isInbox ? <Button href={`/#invites/${inviteId}/accept`} text={'Accept'}/> : null }
                        {isInbox ? <Button href={`/#invites/${inviteId}/decline`} text={'Decline'} extraStyleClasses={'mRed'}/> : null }
                        {isOutBox ? <Button href={`/#invites/${inviteId}/cancel`} text={'Cancel'} extraStyleClasses={'mRed'}/> : null }
                    </div>
                </div>
            </div>
		</div>
        );
    }
});


module.exports = InviteView;
