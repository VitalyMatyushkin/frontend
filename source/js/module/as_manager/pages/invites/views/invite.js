const   React           = require('react'),
	Morearty		= require('morearty'),
	classNames      = require('classnames'),
	DateHelper		= require('./../../../../helpers/date_helper'),
	MoreartyHelper	= require('module/helpers/morearty_helper'),
	Button			= require('module/ui/button/button'),
	Map 			= require('module/ui/map/map-event-venue'),
	Bootstrap  	    = require('styles/bootstrap-custom.scss');

const InviteView = React.createClass({
	mixins: [Morearty.Mixin],
// ID of current school
// Will set on componentWillMount event
	activeSchoolId: undefined,
	propTypes: {
		type: React.PropTypes.oneOf(['inbox', 'outbox', 'archive']),
		onDecline: React.PropTypes.func
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
	addZeroToFirst: function (num) {
		return String(num).length === 1 ? '0' + num : num;
	},
	_getAges: function (data) {
		var result = '';

		if (data !== undefined) {
			result = data.map(function (elem) {
				return 'Y' + elem;
			}).join(", ");
		}

		return result;
	},
	_getGender: function (gender) { //TODO Move this method into helpers
		switch (gender) {
			case 'MALE_ONLY':
				return 'Boys';
			case 'FEMALE_ONLY':
				return 'Girls';
			case 'MIXED':
				return 'Mixed';
			default:
				return '';
		}
	},

	_getInviteRequest: function (inviteId, type) {
		const self = this;

		window.confirmAlert(
			`Are you sure you want to ${type} ?`,
			"Ok",
			"Cancel",
			() => self.props.onDecline && self.props.onDecline(inviteId),
			() => {}
		);
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
			sport           = binding.get('sport.name'),
			ages            = binding.get('event.ages'),
			gender          = binding.get('event.gender'),
			message         = binding.get('message') || '',
			accepted        = binding.get('status') === 'ACCEPTED',
			eventDate       = (new Date(binding.get('event.startTime'))),
			startDate       = DateHelper.getDateStringFromDateObject(eventDate),
			hours           = self.addZeroToFirst(eventDate.getHours()),
			minutes         = self.addZeroToFirst(eventDate.getMinutes()),
			inviteId		= binding.get('id'),
			venue 			= binding.toJS('event.venue'),
			teamData        = binding.toJS('event.teamsData'),
			venueArea 		= venue.postcodeId ? <Map binding={binding} venue={venue} />
				: <span className="eInvite_venue">Venue to be defined</span>;

		let status, teamDataName;

		if (teamData.length > 0) {
			for (let i=0; i < teamData.length; i++){
				if (inviterSchool.id === teamData[i].schoolId) {
					if (isInbox) {
						teamDataName = <h4>Opponent team name: {teamData[i].name}</h4>;
					} else if (isOutBox) {
						teamDataName = <h4>Our team name: {teamData[i].name}</h4>;
					}
				} else {
					teamDataName = <h4></h4>;
				}
			}
		} else {
			teamDataName = <h4></h4>;
		}

		switch (true) {
			case isArchive && accepted:
				status = 'Accepted';
				break;
			case isArchive && !accepted:
				status = 'Declined';
				break;
			default:
				status = '';
		}

		return (
			<div className={inviteClasses}>

				<div className="row">

					<div className="col-md-6 eInvite_left">
						<div className="row">
							<div className="col-md-5 col-sm-5">
								<div className="eInvite_img" style={schoolPicture}></div>
							</div>
							<div className="eInvite_info col-md-7 col-sm-7">

								<h4> {rival.name }</h4>
								{teamDataName}

								<div className="eInvite_content">
									{sport} / {self._getGender(gender)} / {self._getAges(ages)} <br/>
									{startDate} / {hours + ':' + minutes}<br/>
								</div>
								<div>
									<div className="eInvite_message">
										{isArchive ? <span className={'m'+status}>{status}</span> : null}
									</div>
									<div className="eInvite_buttons">
										{isInbox ? <Button href={`/#invites/${inviteId}/accept`} text={'Accept'}
														   extraStyleClasses={'mHalfWidth mMarginRight'}/> : null }
										{isInbox ? <Button text={'Decline'}
														   onClick={() => self._getInviteRequest(inviteId,'decline')}
														   extraStyleClasses={'mCancel mHalfWidth'}/> : null }
										{isOutBox ?
											<Button text={'Cancel invitation'}
													onClick={() => self._getInviteRequest(inviteId,'cancel')}
													extraStyleClasses={'mCancel'}/> : null }
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-6">
						<div className="eInvite_map">{venueArea}</div>
					</div>
				</div>
			</div>

		);
	}
});


module.exports = InviteView;
