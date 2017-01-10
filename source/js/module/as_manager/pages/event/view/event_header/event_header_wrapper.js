/**
 * Created by Woland on 10.01.2017.
 */
const React 		= require('react'),
	Morearty 		= require('morearty'),
	MoreartyHelper	= require('module/helpers/morearty_helper'),
	Immutable		= require('immutable'),
	Promise			= require('bluebird'),

	ChallengeModel	= require('module/ui/challenges/challenge_model'),

	RoleHelper		= require('module/helpers/role_helper'),
	TeamHelper		= require('module/ui/managers/helpers/team_helper'),
	EventHelper		= require('module/helpers/eventHelper'),

	EventHeader 	= require('./event_header'),
	Buttons			= require('./buttons');

const EventHeaderWrapper = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: React.PropTypes.string.isRequired
	},

	/**
	 * The event handler when clicking the button "Cancel"
	 */
	handleClickCancelMatch: function () {
		const binding	= this.getDefaultBinding(),
			schoolId = MoreartyHelper.getActiveSchoolId(this),
			eventId = binding.toJS('model.id');

		window.confirmAlert(
			"You are going to cancel the fixture. Are you sure?",
			"Ok",
			"Cancel",
			() => {
				window.Server.eventCancel.post({
					schoolId: schoolId,
					eventId: eventId
				})
					.then(function(){
						document.location.hash = 'events/calendar';
					});
			},
			() => {}
		);
	},
	/**
	 * The event handler when clicking the button "Change score" or "Close event"
	 */
	handleClickCloseEvent: function () {
		const binding = this.getDefaultBinding();

		binding.set('mode', 'closing');
	},
	/**
	 * The event handler when clicking the button "Cancel" after clicking the button "Change score"
	 */
	onClickCloseCancel: function () {
		const	binding	= this.getDefaultBinding();

		binding
			.atomically()
			.set('mode', 'general')
			.commit();

		this.revertScore();
	},
	/**
	 * Set init state of score. See to component will mount function of Event React Component.
	 */
	revertScore: function() {
		const binding	= this.getDefaultBinding();

		const updEvent = binding.toJS('model');
		updEvent.results = updEvent.initResults;

		binding.set('model', Immutable.fromJS(updEvent));
	},
	/**
	 * The event handler when clicking the button "Save" after clicking the button "Change score"
	 */
	onClickOk: function () {
		if(this.getDefaultBinding().get('model.status') === "FINISHED") {
			this.submitScore();
		} else {
			this.closeMatch();
		}
	},

	submitScore: function() {
		const binding = this.getDefaultBinding();

		const event = binding.toJS('model');

		if(!TeamHelper.checkValidationResultBeforeSubmit(event))
			return;

		if(TeamHelper.isNonTeamSport(event)) {
			return this.submitResultsForIndividualSport(event).then(() => this.doActionsAfterCloseEvent());
		} else {
			return this.submitResultsForTeamsSport(event).then(() => this.doActionsAfterCloseEvent());
		}
	},
	submitResultsForIndividualSport: function(event) {
		return this.submitSchoolResults(event)
			.then(() => this.submitHouseResults(event))
			.then(() => this.submitIndividualResults(event));
	},
	submitResultsForTeamsSport: function(event) {
		return this.submitSchoolResults(event)
			.then(() => this.submitHouseResults(event))
			.then(() => this.submitTeamResults(event))
			.then(() => this.submitIndividualResults(event));
	},
	submitSchoolResults: function(event) {
		const activeSchoolId = MoreartyHelper.getActiveSchoolId(this);

		const body = event.results.schoolScore;

		switch (true) {
			case body.length === 1:
				let newIsWinnerValue;
				if(TeamHelper.isOneOnOneSport(event)) {
					newIsWinnerValue = event.results.schoolScore[0].score > event.results.individualScore[0].score ? true : false;
				} else {
					newIsWinnerValue = event.results.schoolScore[0].score > event.results.teamScore[0].score ? true : false;
				}
				body[0].isWinner = newIsWinnerValue;
				break;
			case body.length === 2 && body[0].score > body[1].score:
				body[0].isWinner = true;
				body[1].isWinner = false;
				break;
			case body.length === 2 && body[0].score < body[1].score:
				body[0].isWinner = false;
				body[1].isWinner = true;
				break;
			case body.length === 2 && body[0].score === body[1].score:
				body[0].isWinner = false;
				body[1].isWinner = false;
				break;
		}

		if(body.length !== 0) {
			const promises = [];

			promises.push(
				body
					.filter(scoreData => this.isNewResultItem(scoreData))
					.map(scoreData => window.Server.schoolEventResultSchoolScores.post({ schoolId: activeSchoolId, eventId: event.id }, scoreData))
			);

			promises.push(
				body
					.filter(scoreData => !this.isNewResultItem(scoreData))
					.map(
						scoreData => window.Server.schoolEventResultSchoolScore.put(
							{
								schoolId	: activeSchoolId,
								eventId		: event.id,
								scoreId		: scoreData._id
							},
							scoreData
						)
					)
			);

			return Promise.all(promises);
		} else {
			return Promise.resolve(true);
		}
	},
	submitHouseResults: function(event) {
		const activeSchoolId = MoreartyHelper.getActiveSchoolId(this);

		const score = event.results.houseScore;

		switch (true) {
			case score.length === 1:
				let newIsWinnerValue;
				if(TeamHelper.isOneOnOneSport(event)) {
					newIsWinnerValue = event.results.houseScore[0].score > event.results.individualScore[0].score ? true : false;
				} else {
					newIsWinnerValue = event.results.houseScore[0].score > event.results.teamScore[0].score ? true : false;
				}
				score[0].isWinner = newIsWinnerValue;
				break;
			case score.length === 2 && score[0].score > score[1].score:
				score[0].isWinner = true;
				score[1].isWinner = false;
				break;
			case score.length === 2 && score[0].score < score[1].score:
				score[0].isWinner = false;
				score[1].isWinner = true;
				break;
			case score.length === 2 && score[0].score === score[1].score:
				score[0].isWinner = false;
				score[1].isWinner = false;
				break;
		}

		if(score.length !== 0) {
			const promises = [];

			promises.push(
				score
					.filter(scoreData => this.isNewResultItem(scoreData))
					.map(scoreData => window.Server.schoolEventResultHousesScores.post({ schoolId: activeSchoolId, eventId: event.id }, scoreData))
			);

			promises.push(
				score
					.filter(scoreData => !this.isNewResultItem(scoreData))
					.map(
						scoreData => window.Server.schoolEventResultHousesScore.put(
							{
								schoolId	: activeSchoolId,
								eventId		: event.id,
								scoreId		: scoreData._id
							},
							scoreData
						)
					)
			);

			return Promise.all(promises);
		} else {
			return Promise.resolve(true);
		}
	},
	submitTeamResults: function(event) {
		const activeSchoolId = MoreartyHelper.getActiveSchoolId(this);

		const score = event.results.teamScore;

		switch (true) {
			case score.length === 1:
				const opponentScore = (event.results.schoolScore && event.results.schoolScore.length) ?
					event.results.schoolScore[0].score :
					event.results.houseScore[0].score;

				const newIsWinnerValue = opponentScore > event.results.teamScore[0].score;
				score[0].isWinner = newIsWinnerValue;
				break;
			case score.length === 2 && score[0].score > score[1].score:
				score[0].isWinner = true;
				score[1].isWinner = false;
				break;
			case score.length === 2 && score[0].score < score[1].score:
				score[0].isWinner = false;
				score[1].isWinner = true;
				break;
			case score.length === 2 && score[0].score === score[1].score:
				score[0].isWinner = false;
				score[1].isWinner = false;
				break;
		}

		if(score.length !== 0) {
			const promises = [];

			promises.push(
				score
					.filter(scoreData => this.isNewResultItem(scoreData))
					.map(scoreData => window.Server.schoolEventResultTeamScores.post({ schoolId: activeSchoolId, eventId: event.id }, scoreData))
			);

			promises.push(
				score
					.filter(scoreData => !this.isNewResultItem(scoreData))
					.map(
						scoreData => window.Server.schoolEventResultTeamScore.put(
							{
								schoolId	: activeSchoolId,
								eventId		: event.id,
								scoreId		: scoreData._id
							},
							scoreData
						)
					)
			);

			return Promise.all(promises);
		} else {
			return Promise.resolve(true);
		}
	},
	submitIndividualResults: function(event) {
		const score = event.results.individualScore;

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(this);

		if(TeamHelper.isOneOnOneSport(event)) {
			switch (true) {
				case score.length === 1 && EventHelper.isInterSchoolsEvent(event):
					score[0].isWinner = score[0].score > event.results.schoolScore[0].score;
					score[0].isChanged = true;
					break;
				case score.length === 1 && EventHelper.isHousesEvent(event):
					score[0].isWinner = score[0].score > event.results.houseScore[0].score;
					score[0].isChanged = true;
					break;
				case score.length === 2:
					score[0].isWinner = score[0].score > score[1].score;
					score[1].isWinner = score[0].score < score[1].score;
					score[0].isChanged = true;
					score[1].isChanged = true;
					break;
			}
		}

		const promises = [];

		promises.push(
			score
				.filter(scoreData => typeof scoreData.score !== 'undefined' && this.isNewResultItem(scoreData))
				.map(scoreData => window.Server.schoolEventResultIndividualsScores.post({ schoolId: activeSchoolId, eventId: event.id }, scoreData))
		);

		promises.push(
			score
				.filter(scoreData => typeof scoreData.score !== 'undefined' && this.isResultItemChanged(scoreData))
				.map(
					scoreData => window.Server.schoolEventResultIndividualsScore.put(
						{
							schoolId	: activeSchoolId,
							eventId		: event.id,
							scoreId		: scoreData._id
						},
						scoreData
					)
				)
		);

		return Promise.all(promises);
	},

	isNewResultItem: function(resultItem) {
		return typeof resultItem._id === 'undefined';
	},
	isResultItemChanged: function(resultItem) {
		return !this.isNewResultItem(resultItem) && resultItem.isChanged;
	},
	isWinnerChanged: function(oldValue, newValue) {
		return oldValue !== newValue;
	},

	/**
	 * Get updated event from server
	 * And update result and status
	 * Also got event editing page to GENERAL mode
	 */
	doActionsAfterCloseEvent: function() {
		const binding = this.getDefaultBinding();

		const event			= binding.toJS('model'),
			activeSchoolId	= MoreartyHelper.getActiveSchoolId(this);

		return window.Server.schoolEvent.get( { schoolId: activeSchoolId, eventId: event.id } )
			.then(event => {
				binding
					.atomically()
					.set('model.result',	Immutable.fromJS(event.result))
					.set('model.status',	Immutable.fromJS(event.status))
					.set('mode',			Immutable.fromJS('general'))
					.commit();

				// yep i'm always true
				return true;
			});
	},
	/**Save match report
	 * @param {object} event
	 * @returns {Promise} schoolEventReport promise
	 * */
	submitMatchReport: function(event){
		const activeSchoolId = MoreartyHelper.getActiveSchoolId(this);

		return window.Server.schoolEventReport.put({
				schoolId:	activeSchoolId,
				eventId:	event.id
			},
			{
				content: event.matchReport
			}
		);
	},
	/**
	 * Event closing process started after click save button
	 */
	closeMatch: function () {
		const binding = this.getDefaultBinding();

		const event = binding.toJS('model');

		if(!TeamHelper.checkValidationResultBeforeSubmit(event))
			return;

		if(TeamHelper.isNonTeamSport(event)) {
			this.closeMatchForIndividualSport();
		} else {
			this.closeMatchForTeamsSport();
		}
		// match report save
		this.submitMatchReport(event);
	},
	/** event closing process for team sport */
	closeMatchForTeamsSport: function() {
		const binding = this.getDefaultBinding();

		const event = binding.toJS('model');

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(this);

		window.Server.finishSchoolEvent.post({
			schoolId:	activeSchoolId,
			eventId:	event.id
		})
			.then(() => this.submitResultsForTeamsSport(event))
			.then(() => this.doActionsAfterCloseEvent());
	},
	/** event closing process for individual sport */
	closeMatchForIndividualSport: function() {
		const binding = this.getDefaultBinding();

		const event = binding.toJS('model');

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(this);

		window.Server.finishSchoolEvent.post({
			schoolId:	activeSchoolId,
			eventId:	event.id
		})
			.then(() => this.submitResultsForIndividualSport(event))
			.then(() => this.doActionsAfterCloseEvent());
	},
	//TODO I'm not sure, but it non-used function?
	/**
	 * Return reverted team manager binding
	 * Use if user doesn't save changes
	 * @returns {*}
	 */
	getRevertedTeamManagerBindings: function() {
		const binding = this.getDefaultBinding();

		const	teamManagerBindings	= binding.toJS('eventTeams.editPlayers.teamManagerBindings'),
			initialTeamPlayers	= binding.toJS('eventTeams.editPlayers.initialPlayers');

		const event = binding.toJS('model');

		if(TeamHelper.isNonTeamSport(event)) {
			teamManagerBindings[0].teamStudents = initialTeamPlayers;
		} else {
			//teamManagerBindings.forEach(teamManagerBinding => {
			//	teamManagerBinding.teamStudents	= initialTeamPlayers[teamManagerBinding.teamId];
			//	teamManagerBinding.isSync		= false;
			//});
		}

		return teamManagerBindings;
	},
	//TODO I'm not sure, but it non-used function?
	onClickEditCancel: function () {
		const binding = this.getDefaultBinding();

		binding.set('mode', 'general');
	},
	/**
	 * The render component EventHeaderWrapper
	 * @returns {XML}
	 */
	render: function() {
		const binding 						= this.getDefaultBinding(),
			model 							= new ChallengeModel(binding.toJS('model'), this.props.activeSchoolId),
			mode 							= binding.toJS('mode'),
			eventStatus						= binding.toJS('model.status'),
			isUserSchoolWorker 				= RoleHelper.isUserSchoolWorker(this),
			isShowScoreEventButtonsBlock 	= TeamHelper.isShowScoreEventButtonsBlock(this);

		return (
			<div className="bEventHeader">
				<div className="bEventHeader_row">
					<EventHeader
						model = { model }
					/>
					<Buttons
						mode 							= { mode }
						eventStatus 					= { eventStatus }
						isUserSchoolWorker 				= { isUserSchoolWorker }
						isShowScoreEventButtonsBlock 	= { isShowScoreEventButtonsBlock }
						handleClickCancelMatch			= { this.handleClickCancelMatch }
						handleClickCloseEvent			= { this.handleClickCloseEvent }
						onClickCloseCancel				= { this.onClickCloseCancel }
						onClickOk						= { this.onClickOk }
					/>
				</div>
			</div>
		);
	}
});

module.exports = EventHeaderWrapper;