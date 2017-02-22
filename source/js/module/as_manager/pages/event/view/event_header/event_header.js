const	React				= require('react');

const	Lazy				= require('lazy.js'),
		If					= require('../../../../../ui/if/if'),
		DateHelper			= require('module/helpers/date_helper'),
		Buttons				= require('./buttons'),
		PencilButton		= require('../../../../../ui/pencil_button');

const	EventHeaderStyle	= require('../../../../../../../styles/pages/event/b_event_header.scss');

const EventHeader = React.createClass({
	propTypes: {
		event: 							React.PropTypes.object,
		mode:							React.PropTypes.string.isRequired,
		eventStatus:					React.PropTypes.string.isRequired,
		eventAges:						React.PropTypes.array,
		isUserSchoolWorker:				React.PropTypes.bool.isRequired,
		isShowScoreEventButtonsBlock:	React.PropTypes.bool.isRequired,
		handleClickCancelEvent:			React.PropTypes.func.isRequired,
		handleClickCloseEvent:			React.PropTypes.func.isRequired,
		onClickCloseCancel:				React.PropTypes.func.isRequired,
		onClickOk:						React.PropTypes.func.isRequired,
		onClickEditEventButton:			React.PropTypes.func.isRequired
	},
	render: function() {
		const 	event 				= this.props.event,
				eventAges			= Lazy(this.props.eventAges).sort(),
				name				= event.name,
				date				= DateHelper.toLocalWithMonthName(event.dateUTC),
				time				= event.time,
				sport				= event.sport;

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
					</div>
					<div className="eEventHeader_rightSide">
						<Buttons	eventId							= { event.id }
									mode							= { this.props.mode }
									eventStatus 					= { this.props.eventStatus }
									isUserSchoolWorker 				= { this.props.isUserSchoolWorker }
									isShowScoreEventButtonsBlock 	= { this.props.isShowScoreEventButtonsBlock }
									handleClickCancelEvent			= { this.props.handleClickCancelEvent }
									handleClickCloseEvent			= { this.props.handleClickCloseEvent }
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
