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
		const self = this;

		self.initDefaultBinding();
		self.initErrorBinding();
		self.addListeners();

		if(typeof this.props.indexOfDisplayingRival !== 'undefined') {
			self.validate(this.props.indexOfDisplayingRival);
		} else {
			const	binding		= this.getDefaultBinding(),
					teamWrapper	= binding.toJS('teamModeView.teamWrapper');

			teamWrapper.forEach((tw, index) => self.validate(index));
		}
	},
	componentWillUnmount: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		self.listeners.forEach(l => binding.removeListener(l));
	},
	initDefaultBinding: function() {
		const	self			= this,
				defaultBinding	= self.getDefaultBinding(),
				binding			= self.getBinding();

		// Init rival index if need
		if(binding.selectedRivalIndex.toJS() === null) {
			self.initRivalIndex();
		}

		const	teamTable	= this.getTeamTables(),
				teamWrapper	= this.getTeamWrappers();

		defaultBinding
			.atomically()
			.set('isSync', true)
			.set('teamModeView', Immutable.fromJS(
				{
					selectedRivalIndex:	defaultBinding.get('selectedRivalIndex'),
					players:			self.getInitPlayers(),
					teamTable:			teamTable,
					teamWrapper:		teamWrapper
				}
			))
			.commit();
	},
	initErrorBinding: function() {
		const rivals = this.getBinding('rivals').toJS();

		const error = rivals.map(() => {
			return {
				isError:	false,
				text:		''
			}
		});

		this.getBinding('error').set(Immutable.fromJS(error));
	},
	getTeamWrappers: function() {
		const binding = this.getBinding();

		const rivals = binding.rivals.toJS();

		return rivals.map((rival, rivalIndex) => this.getTeamWrapperByRivalIndex(rivalIndex));
	},
	getTeamWrapperByRivalIndex: function(rivalIndex) {
		const defaultBinding = this.getDefaultBinding();

		const	teamId		= this.getTeamIdByOrder(rivalIndex),
				teamName	= this.getTeamNameByOrder(rivalIndex);

		return {
			isLoadingTeam: false,
			filter: undefined,
			prevSelectedTeamId: teamId,
			selectedTeamId: teamId,
			teamsSaveMode: undefined,
			teamName: {
				initName: teamName,
				name: teamName,
				mode: 'show'
			},
			___teamManagerBinding: {
				teamStudents: [],
				blackList: [],
				positions: defaultBinding.get('model.sportModel.field.positions')
			},
			savingChangesMode: ManagerConsts.SAVING_CHANGES_MODE.DOESNT_SAVE_CHANGES,
			isSetTeamLater: false
		};
	},
	getTeamTables: function() {
		const	self			= this,
				binding			= self.getBinding();

		const rivals = binding.rivals.toJS();

		return rivals.map((rival, rivalIndex) => this.getTeamTableByRivalIndex(rivalIndex));
	},
	getTeamTableByRivalIndex: function(rivalIndex) {
		const teamId = this.getTeamIdByOrder(rivalIndex);

		return {
			selectedTeamId	: teamId,
			isSelectedTeam	: typeof team !== 'undefined',
			teamIdBlackList	: this.getTeamIdBlackListByRivalIndex(rivalIndex)
		};
	},
	getTeamIdBlackListByRivalIndex: function(rivalIndex) {
		const teamId = this.getTeamIdByOrder(rivalIndex);

		let teamIdBlackList = [];
		if(typeof teamId !== 'undefined') {
			const rivals = this.getBinding().rivals.toJS();

			teamIdBlackList = rivals
				.filter(r => typeof r.team !== 'undefined')
				.filter(r => r.team.id !== teamId)
				.map(r => r.id);
		}

		return teamIdBlackList;
	},
	getInitPlayers: function() {
		const binding = this.getBinding();

		const rivals = binding.rivals.toJS();

		return rivals.map((rival, rivalIndex) => this.getInitPlayersByOrder(rivalIndex));
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
		const	binding		= this.getDefaultBinding(),
				teamWrapper	= binding.toJS('teamModeView.teamWrapper');

		// set selected rival index for teamModeView
		this.listeners.push(binding.sub('selectedRivalIndex').addListener(() => {
			binding.set('teamModeView.selectedRivalIndex', binding.toJS('selectedRivalIndex'))
		}));

		this.addTeamWrapperListeners();
	},
	addTeamWrapperListeners: function() {
		const binding = this.getDefaultBinding();

		const	event		= this.getDefaultBinding().toJS('model'),
				teamWrapper	= binding.toJS('teamModeView.teamWrapper');

		teamWrapper.forEach((tw, index) => {
			if(
				// for index 0 always true
			index === 0 ||
			(
				index > 1 &&
					// condition for other indexes
				(
					!EventHelper.isEventWithOneIndividualTeam(event) || TeamHelper.isOneOnOneSport(event)
				)
			)
			) {
				this.listeners.push(
					binding.sub(`teamModeView.teamWrapper.${index}.___teamManagerBinding.teamStudents`)
						.addListener(() => this.validate(index))
				);

				this.listeners.push(
					binding.sub(`teamModeView.teamWrapper.${index}.teamName.name`)
						.addListener(() => this.validate(index))
				);
			}

			this.listeners.push(
				binding.sub(`teamModeView.teamWrapper.${index}.isSetTeamLater`)
					.addListener(() => this.validate(index))
			);

			this.addSyncListenersByTeamWrapperIndex(index);
		});
	},
	addSyncListenersByTeamWrapperIndex: function(index) {
		this.addListenerToIsLoadingTeamByIndex(index);
		this.addListenerToTeamManagerIsSearchByIndex(index);
	},
	addListenerToIsLoadingTeamByIndex: function(index) {
		const binding = this.getDefaultBinding();

		this.listeners.push(
			binding.sub(`teamModeView.teamWrapper.${index}.isLoadingTeam`).addListener(eventDescriptor => {
				// team wrapper is loading data
				if(eventDescriptor.getCurrentValue()) {
					binding.set('isSync', false);
				}

				// team wrapper isn't loading data
				if(!eventDescriptor.getCurrentValue() && !binding.get(`teamModeView.teamWrapper.${index}.___teamManagerBinding.isSearch`)) {
					binding.set('isSync', true);
				}
			})
		);
	},
	addListenerToTeamManagerIsSearchByIndex: function(index) {
		const binding = this.getDefaultBinding();

		this.listeners.push(
			binding.sub(`teamModeView.teamWrapper.${index}.___teamManagerBinding.isSearch`).addListener(eventDescriptor => {
				// player selector is loading data
				if(eventDescriptor.getCurrentValue()) {
					binding.set('isSync', false);
				}

				// player selector isn't loading data
				if(!eventDescriptor.getCurrentValue() && !binding.get(`teamModeView.teamWrapper.${index}.isLoadingTeam`)) {
					binding.set('isSync', true);
				}
			})
		);
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