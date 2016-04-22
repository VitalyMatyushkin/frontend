const   Immutable        = require('immutable'),
		AutocompleteTeam = require('module/ui/managers/autocompleteTeam'),
		Autocomplete     = require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		MoreartyHelper   = require('module/helpers/morearty_helper'),
		Team             = require('module/ui/managers/team/defaultTeam'),
		React            = require('react'),
		If               = require('module/ui/if/if'),
		Multiselect      = require('module/ui/multiselect/multiselect'),
		Lazy             = require('lazyjs');

const TeamForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string.isRequired,
		onFormSubmit: React.PropTypes.func
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
		let		sportOptions	= '';

		if(sportsBinding) {
			let sports = sportsBinding.toJS();
			sportOptions = sports.map(function (sport) {
				return <Morearty.DOM.option
					selected={sport.id === binding.get('sportId')}
					value={sport.id}
					key={sport.id + '-sport'}
				>{sport.name}</Morearty.DOM.option>
			});
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
			.set('gender',                   Immutable.fromJS(sports[sportIndex].limits.genders[0]))
			.set('default.model.gender',     Immutable.fromJS(sports[sportIndex].limits.genders[0]))
			.commit();
	},
	_getGenders: function () {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				sportModel	= binding.get('sportModel');

		if (sportModel) {
			return sportModel.toJS().limits.genders.map(function (gender, genInd) {
				var names = {
					male: 'boys',
					female: 'girls'
				};

				return <label key={genInd} onClick={self._changeCompleteGender}>
					<Morearty.DOM.input
						type="radio"
						key={gender + '-gender'}
						value={gender}
						checked={gender === binding.get('gender')}
					/>
					{names[gender]}
				</label>;
			});
		} else {
			return null;
		}
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
	_getSelectedAges: function() {
		const	self	= this,
				ages	= self.getDefaultBinding().get('ages');

		return ages ? ages : [];
	},
	_isShowTeamManager: function() {
		const self = this;

		return !!self.getDefaultBinding().get('ages');
	},
	_onRemovePlayer: function(player) {
		const self = this;

		self.getDefaultBinding().set('removedPlayers', Immutable.fromJS(
			self.getDefaultBinding().get('removedPlayers').push(player)
		));
	},
	_serviceHouseFilter: function() {
		const self = this;
		
		return window.Server.schoolHouses.get({schoolId:MoreartyHelper.getActiveSchoolId(self),filter:{
			order:'name ASC' //Filter by name in ascending order
		}});
	},
	_onSelectHouse: function(id) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set('houseId', Immutable.fromJS(id));
	},
	render: function() {
		const	self					= this,
				binding					= self.getDefaultBinding(),
				sportId					= binding.get('sportId'),
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
							{'Team Name'}
							<Morearty.DOM.input
								className="eManager_field"
								type="text"
								value={binding.get('name')}
								placeholder={'enter name'}
								onChange={Morearty.Callback.set(binding.sub('name'))}
							/>
						</div>
						<If condition={!!binding.get('name')}>
							<div className="eManager_group">
								{'House'}
								<div className="eManager_select_wrap">
									<Autocomplete
										defaultItem={binding.toJS('rival')}
										serviceFilter={self._serviceHouseFilter}
										serverField="name"
										placeholderText={'Select House'}
										onSelect={self._onSelectHouse}
										binding={binding.sub('houses')}
									/>
								</div>
							</div>
						</If>
						<If condition={!!binding.get('name')}>
							<div className="eManager_group">
								{'Team Description'}
								<Morearty.DOM.textarea
									className="eManager_field mTextArea"
									type="text"
									value={binding.get('description')}
									placeholder={'enter description'}
									onChange={Morearty.Callback.set(binding.sub('description'))}
								/>
							</div>
						</If>
						<If condition={!!binding.get('name')}>
							<div className="eManager_group">
								{'Game'}
								<select
									className="eManager_select"
									value={sportId}
									defaultValue={null}
									onChange={self._changeCompleteSport}>
									<Morearty.DOM.option
										key="nullable-type"
										value={null}
										selected="selected"
										disabled="disabled">not selected</Morearty.DOM.option>
									{self._getSports()}
								</select>
							</div>
						</If>
						<If condition={!!binding.get('sportId')}>
							<div className="eManager_group">
								{'Gender'}
								<div className="eManager_radiogroup">
									{self._getGenders()}
								</div>
							</div>
						</If>
						<If condition={!!binding.get('sportId') && !!binding.get('gender')}>
							<div className="eManager_group">
								{'Ages'}
								<Multiselect
									binding={binding}
									items={self._getAgeItems()}
									selections={self._getSelectedAges()}
									onChange={self._changeCompleteAges}
								/>
							</div>
						</If>
						<If condition={self._isShowTeamManager()}>
							<div>
								<div className="eManager_group">
									{'Add player'}
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