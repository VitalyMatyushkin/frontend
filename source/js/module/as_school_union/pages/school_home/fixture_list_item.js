const 	React 					= require('react'),
		DateTimeMixin			= require('module/mixins/datetime'),
		EventHelper				= require('module/helpers/eventHelper'),
		SportIcon				= require('module/ui/icons/sport_icon'),
		ChallengeModel			= require('module/ui/challenges/challenge_model'),
		DivForCricketWithResult = require('module/as_manager/pages/event/view/rivals/div_for_cricket_with_result/div_for_cricket_with_result');

const FixtureListItem = React.createClass({

	mixins: [DateTimeMixin],

	propTypes: {
		event:			React.PropTypes.any.isRequired,
		activeSchoolId: React.PropTypes.string.isRequired
	},
	handleClickFixtureItem: function() {
		document.location.hash = `event/${this.props.event.id}`;
	},

	getFixtureInfo: function(event) {
		return(
			<div>
				<div className="eEventHeader_field mEvent">{event.generatedNames.official}</div>
				<div className="eEventHeader_field mDate">
					{`${this.getDateFromIso(event.startTime)} / ${this.getTimeFromIso(event.startTime)} / ${event.sport.name}`}
				</div>
			</div>
		)
	},

	renderOpponentSide: function (model, order) {
		return (
			<div>
				<div className="eEventRival_logo">
					<img className="eEventRivals_logoPic" src={model.rivals[order].schoolPic}/>
				</div>
				<div className="eEventRival_rivalName">{model.rivals[order].value}</div>
				<div className="eEventRival_score">
					<div className="ePlayer_score mBig">{`${model.scoreAr[order]}`}</div>
				</div>
			</div>
		);
	},
	
	renderGameResultForCricket: function(){
		const sportName = this.props.event.sport.name.toLowerCase();
		
		if (sportName === 'cricket') {
			return (
				<DivForCricketWithResult
					event 			= { this.props.event }
					activeSchoolId 	= { '' } // for school union public site we don't use activeSchoolId
				/>
			);
		} else {
			return null;
		}
	},

	getEventRivals: function (model) {
		if(!model.isEventWithOneIndividualTeam)
			return (
				<div className="bEventRivals">
					{ this.renderGameResultForCricket() }
					<div className="bEventRivals_row">
						<div className="bEventRivals_column mLeft">
							<div className="bEventRival">
								{ this.renderOpponentSide(model, 0) }
							</div>
						</div>
						<div className="bEventRivals_column">
							<div className="bEventRival mRight">
								{ this.renderOpponentSide(model, 1) }
							</div>
						</div>
					</div>
				</div>

			);

		return null;
	},
	handleClickGoBack: function() {
		document.location.hash = 'home';
		document.location.reload();
	},
	render: function() {
		const 	event 			= this.props.event,
				activeSchoolId	= this.props.activeSchoolId,
				challengeModel	= new ChallengeModel(event, activeSchoolId);

		return (
			<div>
				<div className="bEventHeader">
					<div className="bEventHeader_leftSide">
						<div className="eEventHeader_field mEvent">
							{this.getFixtureInfo(event)}
						</div>
					</div>

					<div className="bEventHeader_rightSide">
						<div	onClick		= { this.handleClickGoBack }
								className	= "bButton mCancel"
							>
							Go Back
						</div>
					</div>
				</div>

				<div className="bEventInfo">
					{this.getEventRivals(challengeModel)}
				</div>
			</div>
		)
	}
});

module.exports = FixtureListItem;
