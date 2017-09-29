// @flow

const	React				= require('react');

const	Lazy				= require('lazy.js'),
		Morearty			= require('morearty'),
		If					= require('../../../../../ui/if/if'),
		DateHelper			= require('module/helpers/date_helper'),
		DomainHelper 		= require('module/helpers/domain_helper'),
		RoleHelper 			= require('module/helpers/role_helper'),
		TeamHelper			= require('../../../../../ui/managers/helpers/team_helper'),
		Buttons				= require('./buttons'),
		PencilButton		= require('../../../../../ui/pencil_button'),
		TweetButton 		= require('./tweet_button'),
		propz				= require('propz'),
		EventConsts			= require('module/helpers/consts/events'),
		SchoolConst 		= require('module/helpers/consts/schools'),
		SchoolHelper 		= require('module/helpers/school_helper'),
		ViewSelector		= require('module/ui/view_selector/view_selector'),
		ViewSelectorHelper	= require('module/ui/view_selector/helpers/view_selector_helper');

const	EventHeaderStyle	= require('styles/pages/event/b_event_header.scss');

const EventHeader = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		event:							React.PropTypes.object.isRequired,
		challengeModel:					React.PropTypes.object.isRequired,
		mode:							React.PropTypes.string.isRequired,
		viewMode:						React.PropTypes.string,
		eventAges:						React.PropTypes.array,
		isInviterSchool:				React.PropTypes.bool.isRequired,
		isUserSchoolWorker:				React.PropTypes.bool.isRequired,
		isParent:						React.PropTypes.bool.isRequired,
		isShowScoreEventButtonsBlock:	React.PropTypes.bool.isRequired,
		handleClickCancelEvent:			React.PropTypes.func.isRequired,
		handleClickCloseEvent:			React.PropTypes.func.isRequired,
		onClickAddTeam:					React.PropTypes.func.isRequired,
		handleClickDownloadPdf:			React.PropTypes.func.isRequired,
		onClickCloseCancel:				React.PropTypes.func.isRequired,
		onClickOk:						React.PropTypes.func.isRequired,
		onClickEditEventButton:			React.PropTypes.func.isRequired,
		onSendConsentRequest:			React.PropTypes.func.isRequired,
		onReportNotParticipate:			React.PropTypes.func.isRequired,
		role: 							React.PropTypes.string.isRequired,
		onClickDeleteEvent:				React.PropTypes.func.isRequired,
		onClickAddSchool:				React.PropTypes.func.isRequired,

		//prop for tweet button
		isTweetButtonRender: 			React.PropTypes.bool.isRequired,
		twitterData: 					React.PropTypes.array.isRequired,
		schoolDomain: 					React.PropTypes.string.isRequired,
		activeSchoolId: 				React.PropTypes.string.isRequired,
		twitterIdDefault: 				React.PropTypes.string.isRequired,
		
		//prop for view mode
		onClickViewMode: 				React.PropTypes.func
	},
	/**
	 * Function return string with all Age Groups
	 * @example <caption>Example usage of getEventAges</caption>
	 * //Reception, 5, 6, 7
	 * getEventAges();
	 * @returns {string}
	 */
	getEventAges: function(){
		const 	schoolInfo 		= SchoolHelper.getActiveSchoolInfo(this),
				ageGroupsNaming = propz.get(schoolInfo, ['ageGroupsNaming']),
				data = this.props.eventAges;
		return data.length > 0 ? data
			.sort()
			.map(elem => propz.get(SchoolConst.AGE_GROUPS, [ageGroupsNaming, elem]))
			.join(", ")
			: "All ages";
	},
	getEventLocation: function(){
		const venue = this.props.event.venue;
		const venueType = EventConsts.VENUE_SERVER_CLIENT_MAP[venue.venueType];

		let eventLocation = venueType;
		const postcode = propz.get(venue, ['postcodeData', 'postcode']);
		if(typeof postcode !== 'undefined') {
			eventLocation += `, ${postcode}`;
		}

		return eventLocation;
	},
	//We don't show the pencil (edit) button for parent, student and if event is finished
	isShowPencilButton: function(){
		const role = this.props.role;

		return role !== RoleHelper.USER_ROLES.PARENT && role !== RoleHelper.USER_ROLES.STUDENT && this.props.event.status !== "FINISHED";
	},
	renderViewModeLinks: function(){
		if(TeamHelper.isNewEvent(this.props.event)) {
			return (
				<ViewSelector
					selectorList	= { ViewSelectorHelper.getSelectorList(this.props.event) }
					handleClick		= { this.props.onClickViewMode }
					viewMode		= { this.props.viewMode }
				/>
			);
		} else {
			return null;
		}
	},
	render: function() {
		const	challengeModel		= this.props.challengeModel,
				eventAges			= this.getEventAges(),
				eventLocation		= this.getEventLocation(),
				name				= challengeModel.name,
				date				= DateHelper.toLocalWithMonthName(challengeModel.dateUTC),
				time				= challengeModel.time,
				sport				= challengeModel.sport,
				protocol 			= document.location.protocol + '//',
				eventId				= challengeModel.id,
				schoolDomain 		= DomainHelper.getSubDomain(this.props.schoolDomain),
				linkForTweet 		= this.props.schoolDomain !== '' ? protocol + schoolDomain + '/#event/' + eventId : '',
				score				= challengeModel.isFinished && typeof challengeModel.score !== 'undefined' && challengeModel.score !== '' ? `Score: ${challengeModel.score}` : '',
				textForTweet		= `${name} ${time} / ${date} Years: ${eventAges} ${score}`;

		return (
			<div className="bEventHeader">
				<div className="eEventHeader_row">
					<div className="eEventHeader_leftSide">
						<div className="eEventHeader_field mEvent">
							<div className="eEventHeader_fieldColumn">
								{`${name}`}
							</div>
							<If condition={this.isShowPencilButton()}>
								<div className="eEventHeader_fieldColumn mRelative">
									<div className="eEventHeader_editLinkWrapper">
										<PencilButton extraClassName="mLess" handleClick={this.props.onClickEditEventButton}/>
									</div>
								</div>
							</If>
						</div>
						<div className="eEventHeader_field mDate">{`${time} / ${date} / ${sport}`}</div>
						<div className="eEventHeader_field mAges">{`Years: ${eventAges}`}</div>
						<div className="eEventHeader_field mLocation">{`Venue: ${eventLocation}`}</div>
						<TweetButton
							isTweetButtonRender 	= { this.props.isTweetButtonRender }
							twitterData 			= { this.props.twitterData }
							textForTweet 			= { textForTweet }
							linkForTweet 			= { linkForTweet }
							activeSchoolId 			= { this.props.activeSchoolId }
							twitterIdDefault 		= { this.props.twitterIdDefault }
						/>
						{ this.renderViewModeLinks() }
					</div>
					<div className="eEventHeader_rightSide">
						<Buttons
							event							= { this.props.event }
							mode							= { this.props.mode }
							isInviterSchool 				= { this.props.isInviterSchool }
							isUserSchoolWorker 				= { this.props.isUserSchoolWorker }
							isParent		 				= { this.props.isParent }
							isShowScoreEventButtonsBlock 	= { this.props.isShowScoreEventButtonsBlock }
							handleClickCancelEvent			= { this.props.handleClickCancelEvent }
							handleClickCloseEvent			= { this.props.handleClickCloseEvent }
							handleClickDownloadPdf			= { this.props.handleClickDownloadPdf }
							onClickCloseCancel				= { this.props.onClickCloseCancel }
							onClickOk						= { this.props.onClickOk }
							onSendConsentRequest			= { this.props.onSendConsentRequest }
							onReportNotParticipate			= { this.props.onReportNotParticipate }
							onClickDeleteEvent 				= { this.props.onClickDeleteEvent }
							onClickAddSchool 				= { this.props.onClickAddSchool }
							onClickAddTeam 					= { this.props.onClickAddTeam }
						/>
					</div>
				</div>
			</div>
		);
	}
});


module.exports = EventHeader;
