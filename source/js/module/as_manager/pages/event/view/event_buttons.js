const	If				= require('module/ui/if/if'),
		InvitesMixin	= require('module/as_manager/pages/invites/mixins/invites_mixin'),
		Promise 		= require('bluebird'),
		React			= require('react'),
		Immutable		= require('immutable'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		EventHelper		= require('module/helpers/eventHelper'),
		TeamHelper		= require('module/ui/managers/helpers/team_helper'),
		Morearty		= require('morearty'),
		SVG 			= require('module/ui/svg'),

		Actions			= require('./../actions/actions');

/**
 * This component displays the buttons close, save, cancel and contains methods save and close the event.
 * */
const EventButtons = React.createClass({
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
			.then(() => self.submitSchoolResults(event))
			.then(() => self.submitHouseResults(event))
			.then(() => self.submitTeamResults(event))
			.then(() => self.submitIndividualResults(event))
			.then(() => self.submitIndividualPerformance(event))
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
			.then(() => self.submitSchoolResults(event))
			.then(() => self.submitHouseResults(event))
			.then(() => self.submitIndividualResults(event))
			.then(() => self.submitIndividualPerformance(event))
			.then(() => self.doActionsAfterCloseEvent());
	},
	submitSchoolResults: function(event) {
		const self = this;

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		const body = event.results.schoolScore.map(s => {
			return {
				schoolId:	s.schoolId,
				score:		s.score
			};
		});

		switch (true) {
			case body.length === 1:
				if(TeamHelper.isOneOnOneSport(event)) {
					body[0].isWinner = event.results.schoolScore[0].score > event.results.individualScore[0].score ? true : false;
				} else {
					body[0].isWinner = event.results.schoolScore[0].score > event.results.teamScore[0].score ? true : false;
				}
				break;
			case body.length === 2:
				switch (true) {
					case body[0].score > body[1].score:
						body[0].isWinner = true;
						body[1].isWinner = false;
						break;
					case body[0].score < body[1].score:
						body[0].isWinner = false;
						body[1].isWinner = true;
						break;
				}
				break;
		}

		if(body.length !== 0) {
			return Promise.all(body.map(scoreData => window.Server.schoolEventResultSchoolScore.post({ schoolId: activeSchoolId, eventId: event.id }, scoreData)));
		} else {
			return Promise.resolve(true);
		}
	},
	submitHouseResults: function(event) {
		const self = this;

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		const body = event.results.houseScore.map(h => {
			return {
				houseId:	h.houseId,
				score:		h.score
			};
		});

		switch (true) {
			case body.length === 1:
				if(TeamHelper.isOneOnOneSport(event)) {
					body[0].isWinner = event.results.houseScore[0].score > event.results.individualScore[0].score ? true : false;
				} else {
					body[0].isWinner = event.results.houseScore[0].score > event.results.teamScore[0].score ? true : false;
				}
				break;
			case body.length === 2:
				switch (true) {
					case body[0].score > body[1].score:
						body[0].isWinner = true;
						body[1].isWinner = false;
						break;
					case body[0].score < body[1].score:
						body[0].isWinner = false;
						body[1].isWinner = true;
						break;
				}
				break;
		}

		if(body.length !== 0) {
			return Promise.all(body.map(scoreData => window.Server.schoolEventResultHousesScore.post({ schoolId: activeSchoolId, eventId: event.id }, scoreData)));
		} else {
			return Promise.resolve(true);
		}
	},
	submitTeamResults: function(event) {
		const self = this;

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		const body = event.results.teamScore.map(t => {
			return {
				teamId:	t.teamId,
				score:	t.score
			};
		});

		switch (true) {
			case body.length === 1:
				const opponentScore = (event.results.schoolScore && event.results.schoolScore.length) ?
					event.results.schoolScore[0].score :
					event.results.houseScore[0].score;

				body[0].isWinner = opponentScore > event.results.teamScore[0].score;
				break;
			case body.length === 2:
				switch (true) {
					case body[0].score > body[1].score:
						body[0].isWinner = true;
						body[1].isWinner = false;
						break;
					case body[0].score < body[1].score:
						body[0].isWinner = false;
						body[1].isWinner = true;
						break;
				}
				break;
		}

		if(body.length !== 0) {
			return Promise.all(body.map(scoreData => window.Server.schoolEventResultTeamScore.post({ schoolId: activeSchoolId, eventId: event.id }, scoreData)));
		} else {
			return Promise.resolve(true);
		}
	},
	submitIndividualResults: function(event) {
		const self = this;

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		if(TeamHelper.isOneOnOneSport(event)) {
			if(event.results.individualScore.length === 1 && EventHelper.isInterSchoolsEvent(event)) {
				event.results.individualScore[0].isWinner = event.results.individualScore[0].score > event.results.schoolScore[0].score;
			} else if(event.results.individualScore.length === 1 && EventHelper.isHousesEvent(event)) {
				event.results.individualScore[0].isWinner = event.results.individualScore[0].score > event.results.houseScore[0].score;
			} else if(event.results.individualScore.length === 2) {
				event.results.individualScore[0].isWinner = event.results.individualScore[0].score > event.results.individualScore[1].score;
				event.results.individualScore[1].isWinner = event.results.individualScore[1].score > event.results.individualScore[0].score;
			}
		}

		return Promise.all(
			event.results.individualScore.map(individualScoreData => {
					if (individualScoreData.score)
						window.Server.schoolEventResultIndividualsScore.post(
							{
								schoolId: activeSchoolId,
								eventId: event.id
							},
							individualScoreData
						)
				})
		);
	},
	submitIndividualPerformance: function(event) {
		const self = this;

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		return Promise.all(
			event.results.individualPerformance.map(
				individualPerformanceData => window.Server.schoolEventIndividualPerformance.post(
					{
						schoolId:	activeSchoolId,
						eventId:	event.id
					},
					individualPerformanceData
				)
			)
		);
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
	onClickCloseMatch: function () {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('mode', 'closing');
	},
	/** The Save button handler */
	onClickOk: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		self.closeMatch();
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
	render: function() {
		const self = this;

		return (
			<If condition={EventHelper._isShowEventButtons(self)}>
				<div className="bEventButtons">
					<If condition={TeamHelper.isShowCloseEventButton(self)}>
						<div	onClick		= {self.onClickCloseMatch}
								className	="bButton mHalfWidth"
						>
							Close game
						</div>
					</If>
					<If condition={EventHelper._isShowCancelEventCloseButton(self)}>
						<div
							className="bButton mCancel mMarginRight"
							onClick={self.onClickCloseCancel}
						>
							Cancel
						</div>
					</If>
				</div>
			</If>
		);
	}
});

module.exports = EventButtons;