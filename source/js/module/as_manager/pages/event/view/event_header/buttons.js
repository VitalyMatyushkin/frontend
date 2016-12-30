const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),

		If				= require('module/ui/if/if'),
		InvitesMixin	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		Promise			= require('bluebird'),

		MoreartyHelper	= require('module/helpers/morearty_helper'),
		EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		LinkStyles 	    = require('styles/pages/event/b_event_eLink_cancel_event.scss');

/**
 * This component displays the buttons close, save, cancel and contains methods save and close the event.
 * */
const Buttons = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	displayName: 'EventButtons',
	/** event closing process started after click save button */
	closeMatch: function () {
		const	self		= this,
				binding		= self.getDefaultBinding();

		const event = binding.toJS('model');

		if(!TeamHelper.checkValidationResultBeforeSubmit(event))
			return;

		if(TeamHelper.isNonTeamSport(event)) {
			self.closeMatchForIndividualSport();
		} else {
			self.closeMatchForTeamsSport();
		}
		// match report save
		self.submitMatchReport(event);
	},
	submitScore: function() {
		const	self		= this,
				binding		= self.getDefaultBinding();

		const event = binding.toJS('model');

		if(!TeamHelper.checkValidationResultBeforeSubmit(event))
			return;

		if(TeamHelper.isNonTeamSport(event)) {
			return self.submitResultsForIndividualSport(event).then(() => self.doActionsAfterCloseEvent());
		} else {
			return self.submitResultsForTeamsSport(event).then(() => self.doActionsAfterCloseEvent());
		}
	},
	/** event closing process for team sport */
	closeMatchForTeamsSport: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = binding.toJS('model');

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		window.Server.finishSchoolEvent.post({
				schoolId:	activeSchoolId,
				eventId:	event.id
			})
			.then(() => self.submitResultsForTeamsSport(event))
			.then(() => self.doActionsAfterCloseEvent());
	},
	/** event closing process for individual sport */
	closeMatchForIndividualSport: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = binding.toJS('model');

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		window.Server.finishSchoolEvent.post({
				schoolId:	activeSchoolId,
				eventId:	event.id
			})
			.then(() => self.submitResultsForIndividualSport(event))
			.then(() => self.doActionsAfterCloseEvent());
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
		const self = this;

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

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
	isNewResultItem: function(resultItem) {
		return typeof resultItem._id === 'undefined';
	},
	isResultItemChanged: function(resultItem) {
		return !this.isNewResultItem(resultItem) && resultItem.isChanged;
	},
	isWinnerChanged: function(oldValue, newValue) {
		return oldValue !== newValue;
	},
	submitHouseResults: function(event) {
		const self = this;

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

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
		const self = this;

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

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
		const self = this;
		const score = event.results.individualScore;

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

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
	 * Get updated event from server
	 * And update result and status
	 * Also got event editing page to GENERAL mode
	 */
	doActionsAfterCloseEvent: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	event			= binding.toJS('model'),
				activeSchoolId	= MoreartyHelper.getActiveSchoolId(self);

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
	handleClickCloseEvent: function () {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('mode', 'closing');
	},
	/** The Save button handler */
	onClickOk: function () {
		if(this.getDefaultBinding().get('model.status') === "FINISHED") {
			this.submitScore();
		} else {
			this.closeMatch();
		}
	},
	/**
	 * Return reverted team manager binding
	 * Use if user doesn't save changes
	 * @returns {*}
	 */
	getRevertedTeamManagerBindings: function() {
		const	self			= this,
				binding			= self.getDefaultBinding();

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
	onClickCloseCancel: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding
			.atomically()
			.set('mode', 'general')
			.commit();

		self.revertScore();
	},
	onClickEditCancel: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set('mode', 'general');
	},
	/**
	 * Set init state of score. See to component will mount function of Event React Component.
	 */
	revertScore: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const updEvent = binding.toJS('model');
		updEvent.results = updEvent.initResults;

		binding.set('model', Immutable.fromJS(updEvent));
	},
	onClickCancelMatch: function () {
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
	renderScoreEventButton: function() {
		switch (this.getDefaultBinding().toJS('model.status')) {
			case EventHelper.EVENT_STATUS.FINISHED:
				return (
					<div	onClick		= {this.handleClickCloseEvent}
							className	="bButton mHalfWidth"
					>
						Change score
					</div>
				);
			case EventHelper.EVENT_STATUS.ACCEPTED:
				return (
				<div>
					<div	onClick		= {this.handleClickCloseEvent}
							className	="bButton mFullWidth"
					>
						Close event
					</div>
					<div className="eLink_CancelEvent">
						<a onClick={this.onClickCancelMatch}>
							Cancel
						</a>
					</div>
				</div>
				);
			case EventHelper.EVENT_STATUS.INVITES_SENT: return (
				<div className="eLink_CancelEvent">
					<a onClick={this.onClickCancelMatch}>
						Cancel
					</a>
				</div>
			);
			case EventHelper.EVENT_STATUS.SENDING_INVITES: return (
				<div className="eLink_CancelEvent">
					<a onClick={this.onClickCancelMatch}>
						Cancel
					</a>
				</div>
			);
			case EventHelper.EVENT_STATUS.COLLECTING_INVITE_RESPONSE: return (
				<div className="eLink_CancelEvent">
					<a onClick={this.onClickCancelMatch}>
						Cancel
					</a>
				</div>
			);
		};
	},
	render: function() {
		const self = this;
		return (
			<If condition={EventHelper._isShowEventButtons(self)}>
				<div className="bEventButtons">
					<If condition={TeamHelper.isShowScoreEventButton(self)}>
						{this.renderScoreEventButton()}
					</If>
					<If condition={EventHelper._isShowCancelEventCloseButton(self)}>
						<div	className	= "bButton mCancel mMarginRight"
								onClick		= {self.onClickCloseCancel}
						>
							Cancel
						</div>
					</If>
					<If condition={EventHelper._isShowFinishEventEditingButton(self)}>
						<div	className	= "bButton"
								onClick		= {self.onClickOk}
						>
							Save
						</div>
					</If>
				</div>
			</If>
		);
	}
});

module.exports = Buttons;