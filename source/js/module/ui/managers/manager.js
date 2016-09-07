const	React					= require('react'),
		classNames				= require('classnames'),
		TeamPlayersValidator	= require('./helpers/team_players_validator'),
		TeamHelper				= require('module/ui/managers/helpers/team_helper'),
		EventHelper				= require('./../../helpers/eventHelper'),
		MoreartyHelper			= require('./../../helpers/morearty_helper'),
		GameField				= require('./gameField'),
		TeamModeView			= require('./modes/team_mode_view'),
		Morearty            	= require('morearty'),
		Immutable				= require('immutable');

const Manager = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		isInviteMode: 	React.PropTypes.bool
	},
	componentWillMount: function () {
		const	self = this;

		self._initBinding();

		self._addListeners();

		self._validate(0);
		self._validate(1);
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

		defaultBinding
			.atomically()
			.set('teamModeView', Immutable.fromJS(
				{
					selectedRivalIndex: defaultBinding.get('selectedRivalIndex'),
					players: self.getInitPlayers(),
					teamTable: [
						{
							selectedTeamId: self.getTeamIdByOrder(0),
							exceptionTeamId: self.getTeamIdByOrder(1)
						},
						{
							selectedTeamId: self.getTeamIdByOrder(1),
							exceptionTeamId: self.getTeamIdByOrder(0)
						}
					],
					teamWrapper: [
						{
							filter: undefined,
							prevSelectedTeamId: self.getTeamIdByOrder(0),
							selectedTeamId: self.getTeamIdByOrder(0),
							teamsSaveMode: undefined,
							teamName: {
								initName: self.getTeamNameByOrder(0),
								name: self.getTeamNameByOrder(0),
								mode: 'show'
							},
							___teamManagerBinding: {
								teamStudents: [],
								blackList: [],
								positions: defaultBinding.get('model.sportModel.field.positions')
							}
						},
						{
							filter: undefined,
							prevSelectedTeamId: self.getTeamIdByOrder(1),
							selectedTeamId: self.getTeamIdByOrder(1),
							teamsSaveMode: undefined,
							teamName: {
								initName: self.getTeamNameByOrder(1),
								name: self.getTeamNameByOrder(1),
								mode: 'show'
							},
							___teamManagerBinding: {
								teamStudents: [],
								blackList: [],
								positions: defaultBinding.get('model.sportModel.field.positions')
							}
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
	/**
	 * Add listeners on binding
	 * @private
	 */
	_addListeners: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const event = self.getDefaultBinding().toJS('model');

		binding.sub('selectedRivalIndex').addListener(() => {
			binding.set('teamModeView.selectedRivalIndex', binding.toJS('selectedRivalIndex'))
		});
		binding.sub('teamModeView.teamWrapper.0.___teamManagerBinding.teamStudents').addListener(() => {
			self._validate(0);
		});
		binding.sub('teamModeView.teamWrapper.0.teamName.name').addListener(() => {
			self._validate(0);
		});
		if(!EventHelper.isEventWithOneIndividualTeam(event) || TeamHelper.isOneOnOneSport(event)) {
			binding.sub('teamModeView.teamWrapper.1.___teamManagerBinding.teamStudents').addListener(() => {
				self._validate(1);
			});
			binding.sub('teamModeView.teamWrapper.1.teamName.name').addListener(() => {
				self._validate(1);
			});
		}
		binding.sub('teamModeView.teamWrapper.0.isSetTeamLater').addListener(() => {
			self._validate(0);
		});
		binding.sub('teamModeView.teamWrapper.1.isSetTeamLater').addListener(() => {
			self._validate(1);
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
			const	event	= binding.toJS('model'),
					limits	= event && event.sportModel && event.sportModel.defaultLimits ? {
						maxPlayers:	event.sportModel.defaultLimits.maxPlayers,
						minPlayers:	event.sportModel.defaultLimits.minPlayers,
						minSubs:	event.sportModel.defaultLimits.minSubs,
						maxSubs:	event.sportModel.defaultLimits.maxSubs
					} : {};

			let result;

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

		return rivalsBinding.get().map(function (rival, index) {
			const	disable		= self._isRivalDisable(rival),
					teamClasses	= classNames({
						mActive: selectedRivalIndex == index,
						eChooser_item: true,
						mDisable: disable
					}),
					eventType	= TeamHelper.getEventType(self.getDefaultBinding().toJS('model'))
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

			return (
				<span key={`team-index-${index}`} className={teamClasses}
					  onClick={!disable ? self.onChooseRival.bind(null, index) : null}>{text}
				</span>
			);
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

		if(self.isShowRivals()) {
			return (
				<div className="eManager_chooser">
					<div className="bChooserRival">
						{self._getRivals()}
					</div>
				</div>
			);
		}
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
