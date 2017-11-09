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
		If					= require('../../../../ui/if/if'),
		SchoolHelper 		= require('module/helpers/school_helper'),
		SchoolConst 		= require('module/helpers/consts/schools');

const InviteView = React.createClass({
	mixins: [Morearty.Mixin],
	/**
	 * ID of current school
	 * Will set on componentWillMount event
	 */
	activeSchoolId: undefined,
	propTypes: {
		type		: React.PropTypes.oneOf(['inbox', 'outbox', 'archive']).isRequired,
		onDecline	: React.PropTypes.func
	},

	componentWillMount: function() {
		const inviteCommentsBinding = this.getDefaultBinding().sub('inviteComments');
		inviteCommentsBinding.set('expandedComments', Immutable.fromJS(false));

		this.activeSchoolId = MoreartyHelper.getActiveSchoolId(this);
	},

	getParticipantEmblem: function(inviterSchool, participant){
		if (inviterSchool.kind === 'SchoolUnion') {
			const pic = propz.get(inviterSchool, ['pic']);
			if(pic) return { backgroundImage: `url(${pic})` };
		} else {
			const pic = propz.get(participant, ['pic']);
			if(pic) return { backgroundImage: `url(${pic})` };
		}

	},

	addZeroToFirst: function (num) {
		return String(num).length === 1 ? '0' + num : num;
	},
	/**
	 * Function return string with all Age Groups
	 * @example <caption>Example usage of getAges()</caption>
	 * //Reception, 5, 6
	 * getAges([0, 5, 6]);
	 * @params {array} - array of event age groups
	 * @returns {string}
	 */
	getAges: function (data) {
		const 	schoolInfo 		= SchoolHelper.getActiveSchoolInfo(this),
				ageGroupsNaming = propz.get(schoolInfo, ['ageGroupsNaming']);
		data = data || [];
		return data
			.map(elem => propz.get(SchoolConst.AGE_GROUPS, [ageGroupsNaming, elem]))
			.join(", ");
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

	/**
	 * Detecting rival correctly
	 * @returns {String}
	 */
	getRivalSchool: function(inviterSchool, invitedSchool, activeSchoolId) {
		switch (this.props.type) {
			case 'inbox':
				return inviterSchool;
			case 'outbox':
				return invitedSchool;
			case 'archive':
				return activeSchoolId === inviterSchool.id ? invitedSchool : inviterSchool;
		}
	},
	renderControlButtons: function() {
		const binding = this.getDefaultBinding();

		const inviteId = binding.get('id');

		switch (this.props.type) {
			case 'inbox':
				return (
					<div className="eInvite_buttons">
						<Button
							text				= {'Accept'}
							onClick				= {() => {window.location.hash = `/#invites/${inviteId}/accept`}}
							extraStyleClasses	= {'mHalfWidth mMarginRight'}
						/>
						<Button
							text				= {'Decline'}
							onClick				= {() => this.getInviteRequest(inviteId,'decline')}
							extraStyleClasses	= {'mCancel mHalfWidth'}
						/>
					</div>
				);
			case 'outbox':
				return (
					<div className="eInvite_buttons">
						<Button
							text				= {'Cancel invitation'}
							onClick				= {() => this.getInviteRequest(inviteId,'cancel')}
							extraStyleClasses	= {'mCancel'}
						/>
					</div>
				);
		}
	},
	getLinkText: function(isShowComments){
		return isShowComments ? 'Hide chat' : 'Chat';
	},
	getStatusText: function(isArchive, accepted){
		switch (true) {
			case isArchive && accepted:
				return 'Accepted';
			case isArchive && !accepted:
				return 'Declined';
			default:
				return '';
		}
	},
	getTeamDataName: function(teamData, inviterSchool, isInbox, isOutBox){
		let teamDataName;
		if (teamData.length > 0) {
			for (let i=0; i < teamData.length; i++){
				if (inviterSchool.id === teamData[i].schoolId) {
					if (isInbox) {
						teamDataName = <h4>Opponent team name: {teamData[i].name}</h4>;
					} else if (isOutBox) {
						teamDataName = <h4>Our team name: {teamData[i].name}</h4>;
					}
				} else {
					teamDataName = null;
				}
			}
		} else {
			teamDataName = null;
		}
		return teamDataName;
	},
	getSchoolUnionNameIfNeed: function(inviterSchool){
		if (inviterSchool.kind === 'SchoolUnion') {
			return <h4>{inviterSchool.name}</h4>
		} else {
			return null;
		}
	},
	getRivalName: function(inviterSchool, invitedSchool, invitedSchools, rival){
		if (inviterSchool.kind === 'SchoolUnion') {
			if (Array.isArray(invitedSchools)) {
				return `${invitedSchools.filter(school=> school.id !== this.activeSchoolId).map(school => school.name).join(', ')}`;
			} else {
				return `${invitedSchools.name}`;
			}
		} else {
			return rival.name
		}
	},
	getSchoolInviteRecepient: function(inviterSchool, invitedSchool){
		if (inviterSchool.kind === 'SchoolUnion' && inviterSchool.id === this.activeSchoolId) {
			return <h4>To: {invitedSchool.name}</h4>
		} else {
			return null;
		}
	},
	render: function() {
		const	binding			= this.getDefaultBinding(),
				inviteId		= binding.get('id'),
				inviterSchool 	= binding.toJS('inviterSchool'),
				invitedSchool 	= binding.toJS('invitedSchool'),
				invitedSchools 	= binding.toJS('event.invitedSchools'),
				rival			= this.getRivalSchool(inviterSchool, invitedSchool, this.activeSchoolId),
				inviteClasses 	= classNames({
					bInvite: true,
					mNotRedeemed: !binding.get('redeemed')
				}),
				isInbox 		= this.props.type === 'inbox',
				isOutBox 		= this.props.type === 'outbox',
				isArchive 		= binding.get('status') !== "NOT_READY",
				schoolPicture 	= this.getParticipantEmblem(inviterSchool, rival),
				sport 			= binding.get('sport.name'),
				ages 			= binding.get('event.ages'),
				gender 			= binding.get('event.gender'),
				message 		= binding.get('message') || '',
				accepted 		= binding.get('status') === 'ACCEPTED',
				eventDate 		= (new Date(binding.get('event.startTime'))),
				startDate 		= DateHelper.getDateStringFromDateObject(eventDate),
				hours 			= this.addZeroToFirst(eventDate.getHours()),
				minutes 		= this.addZeroToFirst(eventDate.getMinutes()),
				point 			= binding.toJS('event.venue.postcodeData.point'),
				venue 			= binding.toJS('event.venue'),
				teamData 		= binding.toJS('event.teamsData'),
				toggleLink		= Boolean(binding.sub('inviteComments').toJS('expandedComments')),
				typeBinding		= binding.toJS('isConfirmPopupType') ? binding.toJS('isConfirmPopupType') : '',
				isConfirmPopup 	= binding.toJS('isConfirmPopup') ? binding.toJS('isConfirmPopup') : false,
				venueArea 		= venue.postcodeId ? <Map point={point} />
									: <span className="eInvite_venue">Venue to be defined</span>;
									
		return (
			<div className={inviteClasses}>
				<div className="row">
					<div className="col-md-6 eInvite_left">
						<div className="row">
							<div className="col-md-5 col-sm-5">
								<div className="eInvite_img" style={schoolPicture}></div>
							</div>
							<div className="eInvite_info col-md-7 col-sm-7">
								{ this.getSchoolUnionNameIfNeed(inviterSchool) }
								<h4> { this.getRivalName(inviterSchool, invitedSchool, invitedSchools, rival) } </h4>
								{ this.getSchoolInviteRecepient(inviterSchool, invitedSchool) }
								{ this.getTeamDataName(teamData, inviterSchool, isInbox, isOutBox) }
								<div className="eInvite_content">
									{sport} / {this.getGender(gender)} / {this.getAges(ages)} <br/>
									{startDate} / {hours + ':' + minutes}<br/>
								</div>
								<div>
									<div className="eInvite_message">
										{isArchive ?
											<span className={ 'm' + this.getStatusText(isArchive, accepted) }>
												{ this.getStatusText(isArchive, accepted) }
											</span>
											: null}
									</div>
									{this.renderControlButtons()}
									<div className="eInviteDiscussionLink">
										<a onClick={this.toogleDiscussionLink}> { this.getLinkText(toggleLink) } </a>
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
