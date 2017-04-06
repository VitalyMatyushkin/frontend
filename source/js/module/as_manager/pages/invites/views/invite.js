const	React 				= require('react'),
		Morearty			= require('morearty'),
		Immutable 			= require('immutable'),
		classNames 			= require('classnames'),
		DateHelper			= require('./../../../../helpers/date_helper'),
		MoreartyHelper		= require('module/helpers/morearty_helper'),
		Button				= require('module/ui/button/button'),
		Map 				= require('module/ui/map/map2'),
		propz				= require('propz'),
		Bootstrap 			= require('styles/bootstrap-custom.scss'),
		InviteComments		= require('./invite_comments'),
		ConfirmDeclinePopup	= require('./confirm-decline-popup'),
		InviteStyles 		= require('styles/pages/events/b_invite.scss'),
		If					= require('../../../../ui/if/if');

const InviteView = React.createClass({
	mixins: [Morearty.Mixin],
	/**
	 * ID of current school
	 * Will set on componentWillMount event
	 */
	activeSchoolId: undefined,
	propTypes: {
		type		: React.PropTypes.oneOf(['inbox', 'outbox', 'archive']),
		onDecline	: React.PropTypes.func
	},

	componentWillMount: function() {
		const inviteCommentsBinding = this.getDefaultBinding().sub('inviteComments');
		inviteCommentsBinding.set('expandedComments', Immutable.fromJS(false));

		this.activeSchoolId = MoreartyHelper.getActiveSchoolId(this);
	},

	getParticipantEmblem: function(participant){
		const pic = propz.get(participant, ['pic']);
		if(pic) return { backgroundImage: `url(${pic})` };
	},

	addZeroToFirst: function (num) {
		return String(num).length === 1 ? '0' + num : num;
	},

	getAges: function (data) {
		data = data || [];
		return data.map(elem =>{return elem === 0 ? 'Reception' : 'Y' + elem}).join(", ");
	},

	getGender: function (gender) { //TODO Move this method into helpers
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

	getInviteRequest: function(inviteId, type) {
		const binding = this.getDefaultBinding();

		binding.set('isConfirmPopup', Immutable.fromJS(true));
		binding.set('isConfirmPopupType', Immutable.fromJS(type));
	},
	closePopup: function() {
		const binding = this.getDefaultBinding();
		binding.set('isConfirmPopup', Immutable.fromJS(false));
	},

	toogleDiscussionLink: function() {
		const binding = this.getDefaultBinding().sub('inviteComments'),
			expanded = binding.toJS('expandedComments');

		binding.set('expandedComments', Immutable.fromJS(!expanded));
	},
	isShowComments: function() {
		return this.getDefaultBinding().toJS('inviteComments.expandedComments');
	},
	render: function() {
		const binding			= this.getDefaultBinding(),
				inviterSchool 	= binding.toJS('inviterSchool'),
				invitedSchool 	= binding.toJS('invitedSchool'),
				rival 			= invitedSchool.id === this.activeSchoolId ? inviterSchool : invitedSchool,
				inviteClasses 	= classNames({
					bInvite: true,
					mNotRedeemed: !binding.get('redeemed')
				}),
				isInbox 		= this.props.type === 'inbox',
				isOutBox 		= this.props.type === 'outbox',
				isArchive 		= binding.get('status') !== "NOT_READY",
				schoolPicture 	= this.getParticipantEmblem(rival),
				sport 			= binding.get('sport.name'),
				ages 			= binding.get('event.ages'),
				gender 			= binding.get('event.gender'),
				message 		= binding.get('message') || '',
				accepted 		= binding.get('status') === 'ACCEPTED',
				eventDate 		= (new Date(binding.get('event.startTime'))),
				startDate 		= DateHelper.getDateStringFromDateObject(eventDate),
				hours 			= this.addZeroToFirst(eventDate.getHours()),
				minutes 		= this.addZeroToFirst(eventDate.getMinutes()),
				inviteId		= binding.get('id'),
				point 			= binding.toJS('event.venue.postcodeData.point'),
				venue 			= binding.toJS('event.venue'),
				teamData 		= binding.toJS('event.teamsData'),
				toggleLink		= binding.sub('inviteComments').toJS('expandedComments'),
				typeBinding		= binding.toJS('isConfirmPopupType') ? binding.toJS('isConfirmPopupType') : '',
				isConfirmPopup 	= binding.toJS('isConfirmPopup') ? binding.toJS('isConfirmPopup') : false,
				venueArea 		= venue.postcodeId ? <Map point={point} />
									: <span className="eInvite_venue">Venue to be defined</span>;


		let status, teamDataName, linkText, confirmDeclineEvent;

		if (toggleLink) {
			linkText = 'Hide chat';
		} else {
			linkText = 'Chat with opponent';
		}
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
									{sport} / {this.getGender(gender)} / {this.getAges(ages)} <br/>
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
														   onClick={() => this.getInviteRequest(inviteId,'decline')}
														   extraStyleClasses={'mCancel mHalfWidth'}/> : null }
										{isOutBox ?
											<Button text={'Cancel invitation'}
													onClick={() => this.getInviteRequest(inviteId,'cancel')}
													extraStyleClasses={'mCancel'}/> : null }
									</div>
									<div className="eInviteDiscussionLink">
										<a onClick={this.toogleDiscussionLink}> { linkText } </a>
									</div>
								</div>
							</div>
						</div>
					</div>
					<div className="col-md-6">
						<div className="eInvite_map">{venueArea}</div>
					</div>
				</div>
				<If condition={this.isShowComments()}>
					<div className="eInvite_comments">
						<InviteComments	binding			= {binding.sub('inviteComments')}
										inviteId		= {inviteId}
										activeSchoolId	= {this.activeSchoolId}
						/>
					</div>
				</If>
				<ConfirmDeclinePopup	type			= {typeBinding}
										isConfirmPopup	= {isConfirmPopup}
										inviteId		= {inviteId}
										onClosePopup	= {this.closePopup}
										onDecline		= {this.props.onDecline}
										commentText		= ''
				/>
			</div>

		);
	}
});


module.exports = InviteView;
