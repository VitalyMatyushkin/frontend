const	React					= require('react'),
		classNames				= require('classnames'),
		TeamPlayersValidator	= require('./helpers/team_players_validator'),
		GameField				= require('./gameField'),
		TeamModeView			= require('./modes/team_mode_view'),
		Immutable				= require('immutable');

const Manager = React.createClass({
	mixins: [Morearty.Mixin],
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
					teamTable: [
						{
							selectedTeamId: undefined,
							exceptionTeamId: undefined
						},
						{
							selectedTeamId: undefined,
							exceptionTeamId: undefined
						}
					],
					teamWrapper: [
						{
							filter: undefined,
							selectedTeamId: undefined,
							teamsSaveMode: undefined,
							teamName: {
								name: undefined,
								mode: 'show'
							}
						},
						{
							filter: undefined,
							selectedTeamId: undefined,
							teamsSaveMode: undefined,
							teamName: {
								name: undefined,
								mode: 'show'
							}
						}
					]
				}
			))
			.commit();
	},
	/**
	 * Add listeners on binding
	 * @private
	 */
	_addListeners: function() {
		const	self			= this,
				binding	= self.getDefaultBinding();

		binding.sub('selectedRivalIndex').addListener(() => {
			binding.set('teamModeView.selectedRivalIndex', binding.toJS('selectedRivalIndex'))
		});
		binding.sub('mode').addListener(() => {
			self._validate(binding.toJS('selectedRivalIndex'));
		});
		binding.sub('teamModeView.teamWrapper.0.players').addListener(() => {
			self._validate(0);
		});
		binding.sub('teamModeView.teamWrapper.1.players').addListener(() => {
			self._validate(1);
		});
		binding.sub('teamModeView.teamWrapper.0.creationMode').addListener(() => {
			self._validate(0);
		});
		binding.sub('teamModeView.teamWrapper.1.creationMode').addListener(() => {
			self._validate(1);
		});
		binding.sub('teamModeView.teamWrapper.0.teamName.name').addListener(() => {
			self._validate(0);
		});
		binding.sub('teamModeView.teamWrapper.1.teamName.name').addListener(() => {
			self._validate(1);
		});
	},
	_validate: function(rivalIndex) {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				errorBinding	= self.getBinding('error'),
				limits			= {
					maxPlayers: binding.toJS('model.sportModel.limits.maxPlayers'),
					minPlayers: binding.toJS('model.sportModel.limits.minPlayers'),
					maxSubs:    binding.toJS('model.sportModel.limits.maxSubs')
				};
		let		result;

		if(binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.creationMode`) === undefined) {
			result = {
				isError: true,
				text: 'Please select team or create new team'
			}
		} else if (
			binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.teamName.name`) === undefined ||
			binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.teamName.name`) === ''
		) {
			result = {
				isError:	true,
				text:		'Please enter team name'
			};
		} else {
			result = TeamPlayersValidator.validate(
				binding.toJS(`teamModeView.teamWrapper.${rivalIndex}.players`),
				limits
			);
		}

		errorBinding.sub(rivalIndex).set(
			Immutable.fromJS(result)
		);
	},
	_initRivalIndex: function() {
		const	self		= this,
				eventType	= self.getDefaultBinding().toJS('model.type');
		let		currentRivalIndex;

		if(eventType === 'inter-schools') {
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
					eventType	= self.getDefaultBinding().toJS('model.type');
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
				<span className={teamClasses}
					  onClick={!disable ? self.onChooseRival.bind(null, index) : null}>{text}
				</span>
			);
		}).toArray();
	},
	_isRivalDisable: function(rival) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			rival.get('id') !== binding.get('schoolInfo.id') &&
			binding.get('model.type') === 'inter-schools'
		);
	},
	render: function() {
		const	self				= this,
				defaultBinding		= self.getDefaultBinding(),
				binding				= self.getBinding(),
				selectedRivalIndex	= self.getBinding('selectedRivalIndex').toJS(),
				gameFieldBinding	= {
					default:	defaultBinding.sub('model.sportModel.fieldPic')
				},
				teamModeViewBinding	= {
					default:	defaultBinding.sub(`teamModeView`),
					schoolInfo:	defaultBinding.sub('schoolInfo'),
					model:		defaultBinding.sub('model'),
					rivals:		defaultBinding.sub('rivals')
				},
				errorText			= binding.error.toJS(selectedRivalIndex).text;

			return (
				<div className="eManager_container">
					<div className="eManager_chooser">
						<div className="bChooserRival">
							{self._getRivals()}
						</div>
					</div>
					<div className="eManager_containerTeam">
						<TeamModeView binding={teamModeViewBinding}/>
						<div className="eManager_gameFieldContainer">
							<GameField binding={gameFieldBinding}/>
						</div>
					</div>
					<div className="eTeam_errorBox">
						{errorText}
					</div>
				</div>
			);
	}
});

module.exports = Manager;
