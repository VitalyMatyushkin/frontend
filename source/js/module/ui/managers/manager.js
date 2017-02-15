const	React					= require('react'),
		classNames				= require('classnames'),
		TeamPlayersValidator	= require('./helpers/team_players_validator'),
		TeamHelper				= require('module/ui/managers/helpers/team_helper'),
		EventHelper				= require('./../../helpers/eventHelper'),
		MoreartyHelper			= require('./../../helpers/morearty_helper'),
		GameField				= require('./gameField'),
		TeamModeView			= require('./modes/team_mode_view'),
		Morearty            	= require('morearty'),
		Immutable				= require('immutable'),
		ManagerConsts			= require('./helpers/manager_consts');

const Manager = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		isInviteMode: 	React.PropTypes.bool
	},
	listeners: [],
	componentWillMount: function () {
		const	self = this;

		self._initBinding();

		self._addListeners();

		self._validate(0);
		self._validate(1);
	},
	componentWillUnmount: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		self.listeners.forEach(l => binding.removeListener(l));
	},
	/**
	 * Init main binding
	 * @private
	 */
	_initBinding: function() {
		const	self			= this,
				defaultBinding	= self.getDefaultBinding(),
				binding			= self.getBinding();

		// Init rival index if need
		if(binding.selectedRivalIndex.toJS() === null) {
			self._initRivalIndex();
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
		const	self	= this,
				binding	= self.getBinding();

		return (
			typeof binding.rivals !== "undefined" &&
			typeof binding.rivals.toJS()[order] !== "undefined" &&
			typeof binding.rivals.toJS()[order].players !== "undefined" ?
				binding.rivals.toJS()[order].players :
				[]
		);
	},
	getTeamNameByOrder: function(order) {
		const	self	= this,
				binding	= self.getBinding();

		return (
			typeof binding.rivals !== "undefined" &&
			typeof binding.rivals.toJS()[order] !== "undefined" &&
			typeof binding.rivals.toJS()[order].team !== "undefined" ?
				binding.rivals.toJS()[order].team.name :
				undefined
		);
	},
	getTeamIdByOrder: function(order) {
		const	self	= this,
				binding	= self.getBinding();

		return (
			typeof binding.rivals !== "undefined" &&
			typeof binding.rivals.toJS()[order].team !== "undefined" ?
				binding.rivals.toJS()[order].team.id :
				undefined
		);
	},
	getTeamTypeByOrder: function(order) {
		const	self	= this,
				binding	= self.getBinding();

		return (
			typeof binding.rivals !== "undefined" &&
			typeof binding.rivals.toJS()[order].team !== "undefined" ?
				binding.rivals.toJS()[order].team.teamType :
				undefined
		);
	},
	/**
	 * Add listeners on binding
	 * @private
	 */
	_addListeners: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = self.getDefaultBinding().toJS('model');

		self.listeners.push(binding.sub('selectedRivalIndex').addListener(() => {
			binding.set('teamModeView.selectedRivalIndex', binding.toJS('selectedRivalIndex'))
		}));
		self.listeners.push(binding.sub('teamModeView.teamWrapper.0.___teamManagerBinding.teamStudents').addListener(() => {
			self._validate(0);
		}));
		self.listeners.push(binding.sub('teamModeView.teamWrapper.0.teamName.name').addListener(() => {
			self._validate(0);
		}));
		if(!EventHelper.isEventWithOneIndividualTeam(event) || TeamHelper.isOneOnOneSport(event)) {
			self.listeners.push(binding.sub('teamModeView.teamWrapper.1.___teamManagerBinding.teamStudents').addListener(() => {
				self._validate(1);
			}));
			self.listeners.push(binding.sub('teamModeView.teamWrapper.1.teamName.name').addListener(() => {
				self._validate(1);
			}));
		}
		self.listeners.push(binding.sub('teamModeView.teamWrapper.0.isSetTeamLater').addListener(() => {
			self._validate(0);
		}));
		self.listeners.push(binding.sub('teamModeView.teamWrapper.1.isSetTeamLater').addListener(() => {
			self._validate(1);
		}));

		this.addSyncListeners();
	},
	addSyncListeners: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

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
	_validate: function(rivalIndex) {
		const	self			= this,
				binding			= self.getDefaultBinding();

		const	isSetTeamLater	= binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.isSetTeamLater`),
				errorBinding	= self.getBinding('error');

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
				} : {};

				let result = {
					isError:	false,
					text:		''
				};

				switch (true) {
					case TeamHelper.isNonTeamSport(event):
						result = TeamPlayersValidator.validate(
							binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.___teamManagerBinding.teamStudents`),
							limits
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
								limits
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
	_initRivalIndex: function() {
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
	onChooseRival: function (index) {
		const	self	= this;

		self.getBinding('selectedRivalIndex').set(Immutable.fromJS(index));
	},
	_getRivals: function () {
		const self = this,
			  selectedRivalIndex = self.getBinding('selectedRivalIndex').toJS(),
			  rivalsBinding = self.getBinding('rivals');

		const event = self.getDefaultBinding().toJS('model');

		return rivalsBinding.get().map(function (rival, index) {
			const	disable		= self._isRivalDisable(rival),
					teamClasses	= classNames({
						mActive: selectedRivalIndex == index,
						eChooser_item: true,
						mDisable: disable
					}),
					eventType	= TeamHelper.getEventType(self.getDefaultBinding().toJS('model'));
			let		text		= '';

			switch (eventType) {
				case 'houses':
				case 'inter-schools':
					text = rival.get('name');
					break;
				case 'internal':
					if(index == 0) {
						text = "First team";
					} else {
						text = "Second team";
					}
					break;
			}

			if(!TeamHelper.isInternalEventForIndividualSport(event)
				&& (self.isShowRivals() || selectedRivalIndex == index)) {
				return (
					<span key={`team-index-${index}`} className={teamClasses}
						  onClick={!disable ? self.onChooseRival.bind(null, index) : null}>{text}
					</span>
				);
			}
		}).toArray();
	},
	_isRivalDisable: function(rival) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		return (
			rival.get('id') !== activeSchoolId &&
			TeamHelper.getEventType(self.getDefaultBinding().toJS('model')) === 'inter-schools'
		);
	},
	_renderRivals: function() {
		const self = this;

		return (
			<div className="eManager_chooser">
				<div className="bChooserRival">
					{self._getRivals()}
				</div>
			</div>
		);
	},
	isShowRivals: function() {
		const self = this;

		const event = self.getDefaultBinding().toJS('model');

		return !self.props.isInviteMode && !(TeamHelper.isIndividualSport(event) && TeamHelper.getEventType(self.getDefaultBinding().toJS('model')) !== 'houses');
	},
	renderGameField: function() {
		const	self			= this,
				binding	= self.getDefaultBinding();

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
		const	self				= this,
				defaultBinding		= self.getDefaultBinding(),
				binding				= self.getBinding(),
				selectedRivalIndex	= self.getBinding('selectedRivalIndex').toJS(),
				teamModeViewBinding	= {
					default:	defaultBinding.sub(`teamModeView`),
					schoolInfo:	defaultBinding.sub('schoolInfo'),
					model:		defaultBinding.sub('model'),
					rivals:		defaultBinding.sub('rivals'),
					error:		binding.error
				};

			return (
				<div className="eManager_container">
					{self._renderRivals()}
					<div className="eManager_containerTeam">
						<TeamModeView binding={teamModeViewBinding}/>
						{self.renderGameField()}
					</div>
				</div>
			);
	}
});

module.exports = Manager;