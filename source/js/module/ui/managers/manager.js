// Main components
const	React					= require('react'),
		Morearty				= require('morearty'),
		Immutable				= require('immutable'),
		propz					= require('propz');

// Manager react components
const	TeamBundle				= require('./team_bundle'),
		RivalChooser			= require('./rival_chooser/rival_chooser'),
		GameField				= require('./gameField');

// Helpers
const	TeamHelper				= require('module/ui/managers/helpers/team_helper'),
		EventHelper				= require('./../../helpers/eventHelper'),
		TeamPlayersValidator	= require('./helpers/team_players_validator');

// Consts
const	ManagerConsts			= require('./helpers/manager_consts');

// Manager styles
const	TeamsManagerStyles		= require('../../../../styles/ui/teams_manager/b_teams_manager.scss'),
		TeamChooserStyles		= require('../../../../styles/ui/teams_manager/b_rival_chooser.scss');

const Manager = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		isInviteMode			: React.PropTypes.bool,
		indexOfDisplayingRival	: React.PropTypes.number
	},
	listeners: [],
	componentWillMount: function () {
		const	self = this;

		self.initBinding();

		self.addListeners();

		if(typeof this.props.indexOfDisplayingRival !== 'undefined') {
			self.validate(this.props.indexOfDisplayingRival);
		} else {
			self.validate(0);
			self.validate(1);
		}
	},
	componentWillUnmount: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		self.listeners.forEach(l => binding.removeListener(l));
	},
	initBinding: function() {
		const	self			= this,
				defaultBinding	= self.getDefaultBinding(),
				binding			= self.getBinding();

		// Init rival index if need
		if(binding.selectedRivalIndex.toJS() === null) {
			self.initRivalIndex();
		}

		const	firstTeam	= self.getTeamIdByOrder(0),
				secondTeam	= self.getTeamIdByOrder(1);

		const	firstTeamName	= self.getTeamNameByOrder(0),
				secondTeamName	= self.getTeamNameByOrder(1);

		defaultBinding
			.atomically()
			.set('isSync', true)
			.set('teamModeView', Immutable.fromJS(
				{
					selectedRivalIndex: defaultBinding.get('selectedRivalIndex'),
					players: self.getInitPlayers(),
					teamTable: [
						{
							selectedTeamId	: firstTeam,
							isSelectedTeam	: typeof firstTeam !== 'undefined',
							exceptionTeamId	: secondTeam
						},
						{
							selectedTeamId	: secondTeam,
							isSelectedTeam	: typeof secondTeam !== 'undefined',
							exceptionTeamId	: firstTeam
						}
					],
					teamWrapper: [
						{
							isLoadingTeam: false,
							filter: undefined,
							prevSelectedTeamId: firstTeam,
							selectedTeamId: firstTeam,
							teamsSaveMode: undefined,
							teamName: {
								initName: firstTeamName,
								name: firstTeamName,
								mode: 'show'
							},
							___teamManagerBinding: {
								teamStudents: [],
								blackList: [],
								positions: defaultBinding.get('model.sportModel.field.positions')
							},
							savingChangesMode: ManagerConsts.SAVING_CHANGES_MODE.DOESNT_SAVE_CHANGES,
							isSetTeamLater: false
						},
						{
							isLoadingTeam: false,
							filter: undefined,
							prevSelectedTeamId: secondTeam,
							selectedTeamId: secondTeam,
							teamsSaveMode: undefined,
							teamName: {
								initName: secondTeamName,
								name: secondTeamName,
								mode: 'show'
							},
							___teamManagerBinding: {
								teamStudents: [],
								blackList: [],
								positions: defaultBinding.get('model.sportModel.field.positions')
							},
							savingChangesMode: ManagerConsts.SAVING_CHANGES_MODE.DOESNT_SAVE_CHANGES,
							isSetTeamLater: false
						}
					]
				}
			))
			.commit();
	},
	getInitPlayers: function() {
		const self = this;

		return [
			self.getInitPlayersByOrder(0),
			self.getInitPlayersByOrder(1)
		];
	},
	getInitPlayersByOrder: function(order) {
		const binding = this.getBinding();

		let players = [];

		if(typeof binding.rivals !== "undefined") {
			const rivals = binding.rivals.toJS();
			const _players = propz.get(rivals, [order, 'players']);
			if(typeof _players !== "undefined") {
				players = _players;
			}
		}

		return players;
	},
	getTeamNameByOrder: function(order) {
		const binding = this.getBinding();

		let teamName;

		if(typeof binding.rivals !== "undefined") {
			const rivals = binding.rivals.toJS();
			teamName = propz.get(rivals, [order, 'team', 'name']);
		}

		return teamName;
	},
	getTeamIdByOrder: function(order) {
		const binding = this.getBinding();

		let teamId;

		if(typeof binding.rivals !== "undefined") {
			const rivals = binding.rivals.toJS();
			teamId = propz.get(rivals, [order, 'team', 'id']);
		}

		return teamId;
	},
	getTeamTypeByOrder: function(order) {
		const	binding	= this.getBinding();

		let teamType;

		if(typeof binding.rivals !== "undefined") {
			const rivals = binding.rivals.toJS();
			teamType = propz.get(rivals, [order, 'team', 'teamType']);
		}

		return teamType;
	},
	addListeners: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = self.getDefaultBinding().toJS('model');

		self.listeners.push(binding.sub('selectedRivalIndex').addListener(() => {
			binding.set('teamModeView.selectedRivalIndex', binding.toJS('selectedRivalIndex'))
		}));
		self.listeners.push(binding.sub('teamModeView.teamWrapper.0.___teamManagerBinding.teamStudents').addListener(() => {
			self.validate(0);
		}));
		self.listeners.push(binding.sub('teamModeView.teamWrapper.0.teamName.name').addListener(() => {
			self.validate(0);
		}));
		if(!EventHelper.isEventWithOneIndividualTeam(event) || TeamHelper.isOneOnOneSport(event)) {
			self.listeners.push(binding.sub('teamModeView.teamWrapper.1.___teamManagerBinding.teamStudents').addListener(() => {
				self.validate(1);
			}));
			self.listeners.push(binding.sub('teamModeView.teamWrapper.1.teamName.name').addListener(() => {
				self.validate(1);
			}));
		}
		self.listeners.push(binding.sub('teamModeView.teamWrapper.0.isSetTeamLater').addListener(() => {
			self.validate(0);
		}));
		self.listeners.push(binding.sub('teamModeView.teamWrapper.1.isSetTeamLater').addListener(() => {
			self.validate(1);
		}));

		this.addSyncListeners();
	},
	addSyncListeners: function() {
		this.addListenerToIsLoadingTeamByIndex(0);
		this.addListenerToIsLoadingTeamByIndex(1);

		this.addListenerToTeamManagerIsSearchByIndex(0);
		this.addListenerToTeamManagerIsSearchByIndex(1);
	},
	addListenerToIsLoadingTeamByIndex: function(index) {
		const binding = this.getDefaultBinding();

		binding.sub(`teamModeView.teamWrapper.${index}.isLoadingTeam`).addListener(eventDescriptor => {
			// team wrapper is loading data
			if(eventDescriptor.getCurrentValue()) {
				binding.set('isSync', false);
			}

			// team wrapper isn't loading data
			if(!eventDescriptor.getCurrentValue() && !binding.get(`teamModeView.teamWrapper.${index}.___teamManagerBinding.isSearch`)) {
				binding.set('isSync', true);
			}
		});
	},
	addListenerToTeamManagerIsSearchByIndex: function(index) {
		const binding = this.getDefaultBinding();

		binding.sub(`teamModeView.teamWrapper.${index}.___teamManagerBinding.isSearch`).addListener(eventDescriptor => {
			// player selector is loading data
			if(eventDescriptor.getCurrentValue()) {
				binding.set('isSync', false);
			}

			// player selector isn't loading data
			if(!eventDescriptor.getCurrentValue() && !binding.get(`teamModeView.teamWrapper.${index}.isLoadingTeam`)) {
				binding.set('isSync', true);
			}
		});
	},
	validate: function(rivalIndex) {
		const	self			= this,
				binding			= self.getDefaultBinding();

		const	isSetTeamLater		= binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.isSetTeamLater`),
				subscriptionPlan	= binding.toJS('schoolInfo.subscriptionPlan'),
				errorBinding		= self.getBinding('error');

		if(isSetTeamLater) {
			errorBinding.sub(rivalIndex).set(
				Immutable.fromJS({
					isError:	false,
					text:		''
				})
			);
		} else {
			const event = binding.toJS('model');

			if(
				typeof event !== 'undefined' &&
				typeof event.sportModel !== 'undefined'
			) {
				const limits = typeof event.sportModel.defaultLimits !== 'undefined' ? {
					maxPlayers:	event.sportModel.defaultLimits.maxPlayers,
					minPlayers:	event.sportModel.defaultLimits.minPlayers,
					minSubs:	event.sportModel.defaultLimits.minSubs,
					maxSubs:	event.sportModel.defaultLimits.maxSubs
				} : {minPlayers: 1};

				let result = {
					isError:	false,
					text:		''
				};

				switch (true) {
					case TeamHelper.isNonTeamSport(event):
						result = TeamPlayersValidator.validate(
							binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.___teamManagerBinding.teamStudents`),
							limits,
							subscriptionPlan
						);
						break;
					case TeamHelper.isTeamSport(event):
						if (
							binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.teamName.name`) === undefined ||
							binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.teamName.name`) === ''
						) {
							result = {
								isError:	true,
								text:		'Please enter team name'
							};
						} else {
							result = TeamPlayersValidator.validate(
								binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.___teamManagerBinding.teamStudents`),
								limits,
								subscriptionPlan,
								true
							);
						}
						break;
				}

				errorBinding.sub(rivalIndex).set(
					Immutable.fromJS(result)
				);
			}
		}
	},
	initRivalIndex: function() {
		const	self		= this,
				event	= self.getDefaultBinding().toJS('model');
		let		currentRivalIndex;

		if(TeamHelper.getEventType(event) === 'inter-schools') {
			let	activeSchoolId	= self.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
				rivals			= self.getBinding().rivals.toJS();

			for(let rivalIndex in rivals) {
				if(rivals[rivalIndex].id === activeSchoolId) {
					currentRivalIndex = rivalIndex;
					break;
				}
			}
		} else {
			currentRivalIndex = 0;
		}

		self.getBinding('selectedRivalIndex').set(Immutable.fromJS(currentRivalIndex));
	},
	renderGameField: function() {
		const binding = this.getDefaultBinding();

		switch (true) {
			case TeamHelper.isNonTeamSport(binding.toJS('model')):
				return null;
			case TeamHelper.isTeamSport(binding.toJS('model')):
				return (
					<div className="eManager_gameFieldContainer">
						<GameField binding={binding.sub('model.sportModel.field.pic')}/>
					</div>
				);
		}
	},
	render: function() {
		const	defaultBinding		= this.getDefaultBinding(),
				binding				= this.getBinding(),
				teamBundleBinding	= {
					default:	defaultBinding.sub(`teamModeView`),
					schoolInfo:	defaultBinding.sub('schoolInfo'),
					model:		defaultBinding.sub('model'),
					rivals:		defaultBinding.sub('rivals'),
					error:		binding.error
				};

			return (
				<div className="bTeamsManager">
					<RivalChooser
						binding					= { binding }
						isInviteMode			= { this.props.isInviteMode }
						indexOfDisplayingRival	= { this.props.indexOfDisplayingRival }
					/>
					<div className="eTeamsManager_body">
						<TeamBundle binding={teamBundleBinding}/>
						{this.renderGameField()}
					</div>
				</div>
			);
	}
});

module.exports = Manager;