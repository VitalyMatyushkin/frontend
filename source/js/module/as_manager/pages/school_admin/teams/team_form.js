const   Immutable			= require('immutable'),
		AutocompleteTeam	= require('module/ui/managers/autocompleteTeam'),
		Autocomplete		= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		MoreartyHelper		= require('module/helpers/morearty_helper'),
		Team				= require('module/ui/managers/team/defaultTeam'),
		React				= require('react'),
		If					= require('module/ui/if/if'),
		Multiselect			= require('module/ui/multiselect/multiselect'),
		EventHelper			= require('module/helpers/eventHelper'),
		Morearty			= require('morearty'),
		Lazy				= require('lazy.js');

const TeamForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title:			React.PropTypes.string.isRequired,
		onFormSubmit:	React.PropTypes.func
	},
	playersListener: undefined,
	componentWillUnmount: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.clear();
	},
	_addPlayersListener: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		self.playersListener = binding.sub('players').addListener((descriptor) => {
			if(descriptor.getCurrentValue() !== undefined && descriptor.getPreviousValue() !== undefined) {
				const currPlayers = descriptor.getCurrentValue().toJS(),
					prevPlayers = descriptor.getPreviousValue().toJS();

				if(currPlayers.length > prevPlayers.length) {
					self._checkRemovedPlayersCache(
						currPlayers[currPlayers.length - 1]
					);
				}
			}
		});
	},
	_checkRemovedPlayersCache: function(player) {
		const	self				= this,
				removedPlayers		= self.getDefaultBinding().toJS('removedPlayers');
		let		foundRemovedPlayer	= Lazy(removedPlayers).findWhere({id: player.id});

		if(foundRemovedPlayer) {
			let players = self.getDefaultBinding().toJS('players');

			players[players.length - 1] = foundRemovedPlayer;
			self.getDefaultBinding().sub('players').withDisabledListener(self.playersListener, () => {
				self.getDefaultBinding().set('players', Immutable.fromJS(players));

				const index = Lazy(removedPlayers).indexOf(foundRemovedPlayer);

				removedPlayers.splice(index, 1);
				self.getDefaultBinding().set('removedPlayers', Immutable.fromJS(removedPlayers));
			});
		}
	},
	_getSports: function () {
		const	self			= this,
				binding			= self.getDefaultBinding(),
				sportsBinding	= binding.get('sports');

		// init with def value
		let sportOptions = [(
			<option	key="not-selected-sport"
					value={''}
			>
				not selected
			</option>
		)];

		if(sportsBinding) {
			let sports = sportsBinding.toJS();
			sportOptions = sportOptions.concat(sports.map(sport => <option value={sport.id} key={`${sport.id}-sport`}>{sport.name}</option>));
		}

		return sportOptions;
	},
	_changeCompleteSport: function (event) {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				sports		= binding.toJS('sports'),
				sportId		= event.target.value,
				sportIndex	= sports.findIndex(function(model) {
					return model.id === sportId;
				});

		binding
			.atomically()
			.set('sportId',                  Immutable.fromJS(event.target.value))
			.set('sportModel',               Immutable.fromJS(sports[sportIndex]))
			.set('default.model.sportModel', Immutable.fromJS(sports[sportIndex]))
			.set('gender',                   Immutable.fromJS(undefined))
			.set('default.model.gender',     Immutable.fromJS(undefined))
			.commit();
	},
	_getGenders: function () {
		const	self		= this,
				binding		= self.getDefaultBinding();

		const sportModel = binding.get('sportModel');

		let genderOptions = [(
			<option	key="not-selected-gender"
					value={undefined}
			>
				not selected
			</option>
		)];

		if(sportModel) {
			const genders = sportModel.toJS().genders;

			genderOptions = genderOptions.concat(Object.keys(genders)
				.filter(genderType => genders[genderType])
				.map((genderType, index) => {
					const genderNames = {
						femaleOnly:	'Female only',
						maleOnly:	'Male only',
						mixed:		'Mixed'
					};

					return (
						<option	key={`${index}-gender`}
								value={genderType}
						>
							{genderNames[genderType]}
						</option>
					);
			}));
		}

		return genderOptions;
	},
	_changeCompleteGender: function (event) {
		const binding = this.getDefaultBinding();

		binding
			.atomically()
			.set('gender',               Immutable.fromJS(event.target.value))
			.set('default.model.gender', Immutable.fromJS(event.target.value))
			.set('default.players',      Immutable.fromJS([]))
			.set('players',              Immutable.fromJS([]))
			.commit();
	},
	_changeCompleteAges: function (selections) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding
			.atomically()
			.set('ages',               Immutable.fromJS(selections))
			.set('default.model.ages', Immutable.fromJS(selections))
			.set('default.players',    Immutable.fromJS([]))
			.set('players',            Immutable.fromJS([]))
			.commit();
	},
	_getAgeItems: function() {
		const	self			= this,
				availableAges	= self.getDefaultBinding().toJS('availableAges');
		let		ageItems		= [];

		if(availableAges) {
			ageItems = availableAges.sort((first,last)=>{return first - last}).map(function (age) {
				return {
					id: age,
					text: 'Y' + age
				};
			});
		}

		return ageItems;
	},
	_getHouseFilterRadioButton: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			<label onClick={self._changeHouseFilter}>
				<Morearty.DOM.input
					type="checkbox"
					value={binding.get('isHouseFilterEnable')}
					checked={binding.get('isHouseFilterEnable')}
				/>
			</label>
		);
	},
	_changeHouseFilter: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding
			.atomically()
			.set('isHouseFilterEnable',	Immutable.fromJS(!binding.get('isHouseFilterEnable')))
			.set('default.model.type',	Immutable.fromJS(!binding.get('isHouseFilterEnable') ? "houses" : null))
			.set('default.players',		Immutable.fromJS([]))
			.set('players',				Immutable.fromJS([]))
			.commit();
	},
	_serviceHouseFilter: function() {
		const self = this;

		//filter:{
		//	order:'name ASC' //Filter by name in ascending order
		//}}
		return window.Server.schoolHouses.get({
			schoolId: MoreartyHelper.getActiveSchoolId(self),
			filter: {
				limit: 100
			}
		});
	},
	_getSelectedAges: function() {
		const	self	= this,
				ages	= self.getDefaultBinding().get('ages');

		return ages ? ages : [];
	},
	_handleChangeName: function(binding, descriptor) {
		binding.set('name', Immutable.fromJS(descriptor.target.value));
	},
	_onRemovePlayer: function(player) {
		const self = this;

		self.getDefaultBinding().set('removedPlayers', Immutable.fromJS(
			self.getDefaultBinding().get('removedPlayers').push(player)
		));
	},
	_onSelectHouse: function(id, model) {
		const	self = this,
				binding = self.getDefaultBinding();

		if(binding.get('isHouseAutocompleteInit')) {
			binding
				.atomically()
				.set('default.model.type',	Immutable.fromJS('houses'))
				.set('rival',				Immutable.fromJS(model))
				.set('houseId',				Immutable.fromJS(id))
				.set('isHouseSelected',		Immutable.fromJS(true))
				.set('default.players',		Immutable.fromJS([]))
				.set('players',				Immutable.fromJS([]))
				.commit();
		} else {
			binding
				.atomically()
				.set('default.model.type',		Immutable.fromJS('houses'))
				.set('rival',					Immutable.fromJS(model))
				.set('houseId',					Immutable.fromJS(id))
				.set('isHouseSelected',			Immutable.fromJS(true))
				.set('isHouseAutocompleteInit',	Immutable.fromJS(true))
				.commit();
		}
	},
	_renderHouseAutocomplete: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		// set house as defaultItem
		// unfortunately we can't set undefined to defaultItem if team isn't house team
		// so either send defaultItem or not
		if(binding.get('isHouseSelected')) {
			return (
				<Autocomplete
					defaultItem={binding.get('rival').toJS()}
					serviceFilter={self._serviceHouseFilter}
					serverField="name"
					placeholderText={'Select House'}
					onSelect={self._onSelectHouse}
					binding={binding.sub('houses')}
				/>
			);
		} else {
			return (
				<Autocomplete
					serviceFilter={self._serviceHouseFilter}
					serverField="name"
					placeholderText={'Select House'}
					onSelect={self._onSelectHouse}
					binding={binding.sub('houses')}
				/>
			);
		}
	},
	_isShowDescription: function(binding) {
		return !!binding.get('name');
	},
	_isShowSportDropdown: function(binding) {
		return !!binding.get('name');
	},
	_isShowGenders: function(binding) {
		const self = this;

		return	self._isShowDescription(binding) &&
				self._isShowSportDropdown(binding) &&
				!!binding.get('sportId');
	},
	_isShowAges: function(binding) {
		const self = this;

		return	self._isShowDescription(binding) &&
				self._isShowSportDropdown(binding) &&
				self._isShowGenders(binding) &&
				!!binding.get('gender')
	},
	_isShowHouseFilterRadioButton: function(binding) {
		const self = this;

		const	ages			= binding.get('ages');
		let		isAgesSelected	= false;

		if(ages && ages.length !== 0) {
			isAgesSelected = true;
		}

		return	self._isShowDescription(binding) &&
				self._isShowSportDropdown(binding) &&
				self._isShowGenders(binding) &&
				self._isShowAges(binding) &&
				isAgesSelected;
	},
	_isShowHouseSelector: function(binding) {
		const self = this;

		return	self._isShowDescription(binding) &&
				self._isShowSportDropdown(binding) &&
				self._isShowGenders(binding) &&
				self._isShowAges(binding) &&
				self._isShowHouseFilterRadioButton(binding) &&
				binding.get('isHouseFilterEnable');
	},
	_isShowTeamManager: function(binding) {
		const self = this;

		if(self._isShowHouseSelector(binding)) {
			return	self._isShowDescription(binding) &&
					self._isShowSportDropdown(binding) &&
					self._isShowGenders(binding) &&
					self._isShowAges(binding) &&
					self._isShowHouseFilterRadioButton(binding) &&
					!!binding.get('isHouseSelected');
		} else {
			return	self._isShowDescription(binding) &&
					self._isShowSportDropdown(binding) &&
					self._isShowGenders(binding) &&
					self._isShowAges(binding) &&
					self._isShowHouseFilterRadioButton(binding);
		}
	},
	render: function() {
		const	self					= this,
				binding					= self.getDefaultBinding();

		const	sportId					= binding.get('sportId'),
				gender					= binding.get('gender'),
				autocompleteTeamBinding	= {
					default:			binding.sub('default'),
					selectedRivalIndex:	binding.sub('selectedRivalIndex'),
					rival:				binding.sub('rival'),
					players:			binding.sub('players')
				},
				teamBinding = {
					default: binding.sub('default'),
					rivalId: binding.sub('selectedRivalIndex'),
					players: binding.sub('players')
				};

		let errorText;

		binding.toJS('error') && (errorText = binding.get('error.text'));

		if(!self.playersListener) {
			self._addPlayersListener();
		}

		return (
			<div style={{paddingTop: 30}}>
				<div className="bManager mBase">
					<h2>{self.props.title}</h2>

					<div className="eManager_base">
						<div className="eManager_group">
							<div className="eManager_label">{'Team Name'}</div>
							<input
								className="eManager_field"
								type="text"
								value={binding.get('name')}
								placeholder={'enter name'}
								onChange={self._handleChangeName.bind(self, binding)}
							/>
						</div>
						<If condition={self._isShowDescription(binding)}>
							<div className="eManager_group">
								<div className="eManager_label">{'Team Description'}</div>
								<textarea
									className="eManager_field mTextArea"
									type="text"
									value={binding.get('description')}
									placeholder={'enter description'}
									onChange={Morearty.Callback.set(binding.sub('description'))}
								/>
							</div>
						</If>
						<If condition={self._isShowSportDropdown(binding)}>
							<div className="eManager_group">
								<div className="eManager_label">{'Game'}</div>
								<select	className="eManager_select"
										defaultValue={''}
										value={sportId}
										onChange={self._changeCompleteSport}
								>
									{self._getSports()}
								</select>
							</div>
						</If>
						<If condition={self._isShowGenders(binding)}>
							<div className="eManager_group">
								<div className="eManager_label">{'Genders'}</div>
								<select	className="eManager_select"
										defaultValue={undefined}
										value={gender}
										onChange={self._changeCompleteGender}
								>
									{self._getGenders()}
								</select>
							</div>
						</If>
						<If condition={self._isShowAges(binding)}>
							<div className="eManager_group">
								<div className="eManager_label">{'Ages'}</div>
								<Multiselect
									binding={binding}
									items={self._getAgeItems()}
									selections={self._getSelectedAges()}
									onChange={self._changeCompleteAges}
								/>
							</div>
						</If>
						<If condition={self._isShowHouseFilterRadioButton(binding)}>
							<div className="eManager_group">
								<div className="eManager_label">{'Filtered By House'}</div>
								<div className="eManager_radiogroup">
									{self._getHouseFilterRadioButton()}
								</div>
							</div>
						</If>
						<If condition={self._isShowHouseSelector(binding)}>
							<div className="eManager_group">
								<div className="eManager_label">{'House'}</div>
								<div className="eManager_select_wrap">
									{self._renderHouseAutocomplete()}
								</div>
							</div>
						</If>
						<If condition={self._isShowTeamManager(binding)}>
							<div>
								<div className="eManager_group">
									<div className="eManager_label">{'Add player'}</div>
									<div className ="eManager_select_wrap">
										<AutocompleteTeam binding={autocompleteTeamBinding}/>
									</div>
								</div>
								<div className="eManager_group">
									{''}
									<Team onRemovePlayer={self._onRemovePlayer} binding={teamBinding}/>
								</div>
								<div className="eManager_group">
									<div className="eTeam_errorBox">
										{errorText}
									</div>
								</div>
								<div className="eForm_savePanel">
									<div className="bButton mRight" onClick={self.props.onFormSubmit}>Finish</div>
								</div>
							</div>
						</If>
					</div>
				</div>
			</div>
		);
	}
});

module.exports = TeamForm;