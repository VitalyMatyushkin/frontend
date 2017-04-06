// @flow

const	React				= require('react');

const	Lazy				= require('lazy.js'),
		If					= require('../../../../../ui/if/if'),
		DateHelper			= require('module/helpers/date_helper'),
		DomainHelper 		= require('module/helpers/domain_helper'),
		Buttons				= require('./buttons'),
		PencilButton		= require('../../../../../ui/pencil_button'),
		TweetButton 		= require('./tweet_button');

const	EventHeaderStyle	= require('../../../../../../../styles/pages/event/b_event_header.scss');

const EventHeader = React.createClass({
	propTypes: {
		event: 							React.PropTypes.object.isRequired,
		mode:							React.PropTypes.string.isRequired,
		eventStatus:					React.PropTypes.string.isRequired,
		eventAges:						React.PropTypes.array,
		isUserSchoolWorker:				React.PropTypes.bool.isRequired,
		isShowScoreEventButtonsBlock:	React.PropTypes.bool.isRequired,
		handleClickCancelEvent:			React.PropTypes.func.isRequired,
		handleClickCloseEvent:			React.PropTypes.func.isRequired,
		handleClickDownloadPdf:			React.PropTypes.func.isRequired,
		onClickCloseCancel:				React.PropTypes.func.isRequired,
		onClickOk:						React.PropTypes.func.isRequired,
		onClickEditEventButton:			React.PropTypes.func.isRequired,
		
		//prop for tweet button
		isTweetButtonRender: 			React.PropTypes.bool.isRequired,
		twitterData: 					React.PropTypes.array.isRequired,
		schoolDomain: 					React.PropTypes.string.isRequired,
		activeSchoolId: 				React.PropTypes.string.isRequired,
		twitterIdDefault: 				React.PropTypes.string.isRequired
	},
	/**
	 * Function return string with all Age Groups
	 * @example <caption>Example usage of getEventAges</caption>
	 * //Reception, 5, 6, 7
	 * getEventAges();
	 * @returns {string}
	 */
	getEventAges: function(){
		return Lazy(this.props.eventAges)
			.sort()
			.toArray()
			.map(age => {return age === 0 ? 'Reception' : age})
			.join(', ');
	},
	render: function() {
		const 	event 				= this.props.event,
				eventAges			= this.getEventAges(),
				name				= event.name,
				date				= DateHelper.toLocalWithMonthName(event.dateUTC),
				time				= event.time,
				sport				= event.sport,
				protocol 			= document.location.protocol + '//',
				eventId				= event.id,
				schoolDomain 		= DomainHelper.getSubDomain(this.props.schoolDomain),
				linkForTweet 		= this.props.schoolDomain !== '' ? protocol + schoolDomain + '/#event/' + eventId : '',
				score 				= event.isFinished && typeof event.score !== 'undefined' && event.score !== '' ? `Score: ${event.score}` : '',
				textForTweet 		= `${name} ${time} / ${date} Years: ${eventAges} ${score}`;

		return (
			<div className="bEventHeader">
				<div className="eEventHeader_row">
					<div className="eEventHeader_leftSide">
						<div className="eEventHeader_field mEvent">
							<div className="eEventHeader_fieldColumn">
								{`${name}`}
							</div>
							<If condition={this.props.eventStatus !== "FINISHED"}>
								<div className="eEventHeader_fieldColumn mRelative">
									<div className="eEventHeader_editLinkWrapper">
										<PencilButton extraClassName="mLess" handleClick={this.props.onClickEditEventButton}/>
									</div>
								</div>
							</If>
						</div>
						<div className="eEventHeader_field mDate">{`${time} / ${date} / ${sport}`}</div>
						<div className="eEventHeader_field mAges">{`Years: ${eventAges}`}</div>
						<TweetButton
							isTweetButtonRender 	= { this.props.isTweetButtonRender }
							twitterData 			= { this.props.twitterData }
							textForTweet 			= { textForTweet }
							linkForTweet 			= { linkForTweet }
							activeSchoolId 			= { this.props.activeSchoolId }
							twitterIdDefault 		= { this.props.twitterIdDefault }
						/>
					</div>
					<div className="eEventHeader_rightSide">
						<Buttons	eventId							= { event.id }
									mode							= { this.props.mode }
									eventStatus 					= { this.props.eventStatus }
									isUserSchoolWorker 				= { this.props.isUserSchoolWorker }
									isShowScoreEventButtonsBlock 	= { this.props.isShowScoreEventButtonsBlock }
									handleClickCancelEvent			= { this.props.handleClickCancelEvent }
									handleClickCloseEvent			= { this.props.handleClickCloseEvent }
									handleClickDownloadPdf			= { this.props.handleClickDownloadPdf }
									onClickCloseCancel				= { this.props.onClickCloseCancel }
									onClickOk						= { this.props.onClickOk }
						/>
					</div>
				</div>
			</div>
		);
	}
});


module.exports = EventHeader;
