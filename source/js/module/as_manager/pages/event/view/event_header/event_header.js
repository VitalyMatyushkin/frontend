const	React			= require('react'),
		DateHelper		= require('module/helpers/date_helper'),
		Buttons			= require('./buttons');

const EventHeader = React.createClass({
	propTypes: {
		event: 							React.PropTypes.object,
		mode:							React.PropTypes.string.isRequired,
		eventStatus:					React.PropTypes.string.isRequired,
		isUserSchoolWorker:				React.PropTypes.bool.isRequired,
		isShowScoreEventButtonsBlock:	React.PropTypes.bool.isRequired,
		handleClickCancelEvent:			React.PropTypes.func.isRequired,
		handleClickCloseEvent:			React.PropTypes.func.isRequired,
		onClickCloseCancel:				React.PropTypes.func.isRequired,
		onClickOk:						React.PropTypes.func.isRequired
	},
	render: function() {
		const 	event 				= this.props.event,
				name				= event.name,
				date				= DateHelper.toLocalWithMonthName(event.dateUTC),
				time				= event.time,
				sport				= event.sport;

		return (
			<div className="bEventHeader">
				<div className="bEventHeader_row">
					<div className="bEventHeader_leftSide">
						<div className="eEventHeader_field mEvent">{`${name}`}</div>
						<div className="eEventHeader_field mDate">{`${time} / ${date} / ${sport}`}</div>
					</div>
					<div className="bEventHeader_rightSide">
						<Buttons
							mode 							= { this.props.mode }
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
