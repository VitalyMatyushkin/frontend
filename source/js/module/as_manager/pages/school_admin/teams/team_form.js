const	React								= require('react'),
		Morearty							= require('morearty'),
		Immutable							= require('immutable'),
		{Autocomplete}						= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		MoreartyHelper						= require('module/helpers/morearty_helper'),
		{If}								= require('module/ui/if/if'),
		TeamHelper							= require('module/ui/managers/helpers/team_helper'),
		classNames							= require('classnames'),
		propz 								= require('propz'),
		{TeamManager}						= require('module/ui/managers/team_manager/team_manager'),
		MultiselectDropdown					= require('module/ui/multiselect-dropdown/multiselect_dropdown'),
		MultiselectDropdownHelper			= require('module/ui/multiselect-dropdown/multiselect_dropdown_helper'),
		SchoolConst 						= require('module/helpers/consts/schools'),
		{ ManagerTypes }					= require('module/ui/managers/helpers/manager_types'),
		{ PlayerChoosersTabsModelFactory }	= require('module/helpers/player_choosers_tabs_models_factory'),
		{ TeamManagerActions }				= require('module/helpers/actions/team_manager_actions');

const	MultiselectDropdownStyles	= require('../../../../../../styles/ui/multiselect_dropdown/bMultiSelectDropdown.scss');

const TeamForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title:			React.PropTypes.string.isRequired,
		onFormSubmit:	React.PropTypes.func
	},
	genderListener: undefined,
	agesListener: undefined,
	houseIdListener: undefined,
	playerChoosersTabsModel: undefined,
	teamManagerActions: undefined,

	componentWillMount: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set('___multiselect', Immutable.fromJS({}));

		binding.sub('gender').addListener(() => {
			self.isFilterAvailable(binding) && self.updateTeamManagerFilter();
		});
		binding.sub('isHouseFilterEnable').addListener(() => {
			self.isFilterAvailable(binding) && self.updateTeamManagerFilter();
		});
		binding.sub('houseId').addListener(() => {
			self.isFilterAvailable(binding) && self.updateTeamManagerFilter();
		});
		binding.sub('ages').addListener(() => {
			self.isFilterAvailable(binding) && self.updateTeamManagerFilter();
		});
		
		this.initPlayerChoosersTabsModel();
		this.initTeamManagerActions();
	},
	componentWillUnmount: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.clear();
	},
	componentDidUpdate: function () {
		const 	binding 			= this.getDefaultBinding(),
				nameCursor 			= binding.toJS('nameCursor'),
				descriptionCursor 	= binding.toJS('descriptionCursor');

		if(nameCursor >= 0){
			this.refs.name.setSelectionRange(nameCursor, nameCursor);
		}
		if(descriptionCursor >= 0){
			this.refs.description.setSelectionRange(descriptionCursor, descriptionCursor);
		}
	},

	clearTeamPlayers: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.set('___teamManagerBinding.teamStudents', Immutable.fromJS([]));
	},
	updateTeamManagerFilter: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	school	= binding.toJS('school'),
				gender	= TeamHelper.getFilterGender(binding.toJS('gender')),
				ages	= binding.toJS('ages'),
				houseId	= self.getHouseFilterCheckboxValue() ? binding.toJS('houseId') : undefined;

		// update team manager filter
		// and delete players from team because filter was changed
		binding.set(
			'___teamManagerBinding.filter',
			Immutable.fromJS(
				TeamHelper.getTeamManagerSearchFilter(
					school,
					ages,
					gender,
					houseId
				)
			)
		);
	},

	isFilterAvailable: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			typeof binding.toJS('gender') !== 'undefined' &&
			typeof binding.toJS('ages') !== 'undefined'
		);
	},
	isHouseSelected: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return !!binding.toJS('isHouseSelected');
	},
	isHouseAutocompleteInit: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return !!binding.toJS('isHouseAutocompleteInit');
	},
	isGenderSelected: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return typeof binding.toJS('gender') !== 'undefined' && binding.toJS('gender') !== '';
	},
	isAgesSelected: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return typeof binding.toJS('ages') !== 'undefined' && binding.toJS('ages').length !== 0;
	},
	isSportSelected: function() {
		const	self	= this,
			binding	= self.getDefaultBinding();

		return	!!binding.get('sportId');
	},
	isShowTeamManager: function() {
		const self = this;

		return	self.isGenderSelected() &&
				(
					self.getHouseFilterCheckboxValue() ?	// if filtered by house then house should be selected
					self.isHouseSelected() :				// for show team manager
					true
				);
	},

	getSports: function () {
		const	self			= this,
				binding			= self.getDefaultBinding();

		const currentSportId = binding.get('sportId');

		// init with def value
		let sportOptions = [(
			<option	key="not-selected-sport"
					value={undefined}
					disabled="disabled"
					selected={typeof currentSportId === 'undefined'}
			>
				Please select
			</option>
		)];

		const sportsBinding = binding.get('sports');
		if(sportsBinding) {
			sportOptions = sportOptions.concat(
				sportsBinding.toJS().map(sport => {
					return (
						<option	value		={sport.id}
								key			={`${sport.id}-sport`}
								selected	={currentSportId === sport.id}
						>
							{sport.name}
						</option>
					);
				})
			);
		}

		return sportOptions;
	},
	getGenders: function () {
		const	self		= this,
				binding		= self.getDefaultBinding();

		const	currentGender	= binding.get('gender'),
				sportModel		= binding.get('sportModel');

		let genderOptions = [];

		//if sport was selected
		if(self.isSportSelected()) {
			genderOptions.push((
				<option	key="not-selected-gender"
						value={undefined}
						disabled="disabled"
						selected={typeof currentGender === 'undefined'}
				>
					Please select
				</option>
			));
		} else {
			genderOptions.push((
				<option	key="not-selected-gender"
						value={undefined}
						disabled="disabled"
						selected={typeof currentGender === 'undefined'}
				>
					At first, select game
				</option>
			));
		}

		if(sportModel) {
			const genders = sportModel.toJS().genders;

			genderOptions = genderOptions.concat(Object.keys(genders)
				.filter(genderType => genders[genderType])
				.map((genderType, index) => {
					const genderNames = {
						femaleOnly:	'Girls only',
						maleOnly:	'Boys only',
						mixed:		'Mixed'
					};

					return (
						<option	key		={`${index}-gender`}
								value	={genderType}
								selected={genderType === currentGender}
						>
							{genderNames[genderType]}
						</option>
					);
				}));
		}

		return genderOptions;
	},
	/** Function return sorted array of object with age groups
	 * @returns {array}
	 */
	getAgeItems: function() {
		const 	binding 		= this.getDefaultBinding(),
				availableAges 	= this.getDefaultBinding().toJS('availableAges'),
				ageGroupsNaming = binding.toJS('school.ageGroupsNaming');

		if(availableAges) {
			return availableAges
				.sort( (first, last) => first - last )
				.map( age => {
					const ageGroup = propz.get(SchoolConst.AGE_GROUPS, [ageGroupsNaming, age]);
					return {
						id: 	age,
						text: 	ageGroup
					};
				});
		}
	},
	getAgeGroupNaming: function() {
		return this.getDefaultBinding().toJS('school.ageGroupsNaming');
	},
	_getAges: function() {
		return MultiselectDropdownHelper.getAgeArray(
			this.getDefaultBinding().toJS('availableAges'),
			this.getAgeGroupNaming()
		);
	},
	_getSelectedAges: function() {
		const ages = typeof this.getDefaultBinding().toJS('ages') !== 'undefined' ?
			this.getDefaultBinding().toJS('ages') :
			[];

		return MultiselectDropdownHelper.getAgeArray(
				ages,
				this.getAgeGroupNaming()
			);
	},
	_handleChangeAges: function (ageItem) {
		const ages = this.getDefaultBinding().toJS('ages');

		const foundAgeIndex = ages.findIndex(a => a === ageItem.id);

		if(foundAgeIndex !== -1) {
			ages.splice(foundAgeIndex, 1);
		} else {
			ages.push(ageItem.id);
		}

		this.clearTeamPlayers();
		this.getDefaultBinding().set('ages', Immutable.fromJS(ages));
	},
	getSelectedAges: function() {
		const	self	= this,
				ages	= self.getDefaultBinding().get('ages');

		return ages ? ages : [];
	},
	getHouseFilterCheckboxValue: function() {
		const	self = this,
				binding = self.getDefaultBinding();

		return !!binding.toJS('isHouseFilterEnable');
	},

	handleChangeName: function(descriptor) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.atomically()
			.set('name', Immutable.fromJS(descriptor.target.value))
			.set('nameCursor', Immutable.fromJS(descriptor.target.selectionStart))
			.commit();
	},
	handleChangeDescription: function(e) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		binding.atomically()
			.set('description', Immutable.fromJS(e.target.value))
			.set('descriptionCursor', Immutable.fromJS(e.target.selectionStart))
			.commit();
	},
	handleSelectHouse: function(id, model) {
		const	self = this,
				binding = self.getDefaultBinding();

		// TODO need comment
		if(self.isHouseAutocompleteInit()) {
			self.clearTeamPlayers();
			binding
				.atomically()
				.set('house',				Immutable.fromJS(model))
				// TODO delete houseId, check house
				.set('houseId',				Immutable.fromJS(id))
				.set('isHouseSelected',		Immutable.fromJS(true))
				.commit();
		} else {
			binding
				.atomically()
				.set('house',					Immutable.fromJS(model))
				// TODO delete houseId, check house
				.set('houseId',					Immutable.fromJS(id))
				.set('isHouseSelected',			Immutable.fromJS(true))
				// TODO need comment
				.set('isHouseAutocompleteInit',	Immutable.fromJS(true))
				.commit();
		}
	},
	handleChangeSport: function (event) {
		const	self		= this,
				binding		= self.getDefaultBinding();

		const	sports		= binding.toJS('sports'),
				sportId		= event.target.value,
				sportIndex	= sports.findIndex(function(model) {
					return model.id === sportId;
				});

		// TODO change filter
		self.clearTeamPlayers();
		binding
			.atomically()
			.set('sportId',							Immutable.fromJS(event.target.value))
			.set('sportModel',						Immutable.fromJS(sports[sportIndex]))
			.set('___teamManagerBinding.positions',	Immutable.fromJS(sports[sportIndex].field.positions))
			.set('gender',							Immutable.fromJS(undefined))
			.commit();
	},
	handleChangeGender: function (event) {
		const	self	= this,
				binding = self.getDefaultBinding();

		//TODO need comment
		self.clearTeamPlayers();
		binding.set('gender', Immutable.fromJS(event.target.value));
	},
	handleChangeAges: function (selections) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		//TODO need comment
		self.clearTeamPlayers();
		binding.set('ages', Immutable.fromJS(selections));
	},
	handleChangeHouseFilter: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		self.clearTeamPlayers();
		binding.set('isHouseFilterEnable', Immutable.fromJS(!self.getHouseFilterCheckboxValue()));
	},

	houseService: function() {
		const self = this;

		return window.Server.schoolHouses.get({
			schoolId: MoreartyHelper.getActiveSchoolId(self),
			filter: {
				limit: 100
			}
		});
	},

	renderHouseFilterCheckbox: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			<input	onChange={self.handleChangeHouseFilter.bind(self, binding)}
					  type="checkbox"
					  id="team_house_filter"
					  checked={self.getHouseFilterCheckboxValue()}
			/>
		);
	},
	renderHouseAutocomplete: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		// set house as defaultItem
		// unfortunately we can't set undefined to defaultItem if team isn't house team
		// so either send defaultItem or not
		if(binding.get('isHouseSelected')) {
			return (
				<Autocomplete
					extraCssStyle	= "mWide"
					defaultItem		= {binding.toJS('house')}
					serviceFilter	= {self.houseService}
					serverField		= "name"
					placeholder		= {'Select House'}
					onSelect		= {self.handleSelectHouse}
					id				= "team_house_select"
				/>
			);
		} else {
			return (
				<Autocomplete
					extraCssStyle	= "mWide"
					serviceFilter	= {self.houseService}
					serverField		= "name"
					placeholder		= {'Select House'}
					onSelect		= {self.handleSelectHouse}
					id				= "team_house_select"
				/>
			);
		}
	},
	initPlayerChoosersTabsModel: function () {
		this.playerChoosersTabsModel = PlayerChoosersTabsModelFactory.createTabsModelByManagerType(
			ManagerTypes.Default
		);
	},
	initTeamManagerActions: function () {
		this.teamManagerActions = new TeamManagerActions( {schoolId: MoreartyHelper.getActiveSchoolId(this)} );
	},
	renderTeamManager: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		if(self.isShowTeamManager()) {
			return (
				<div>
					<TeamManager
						binding 				= { binding.sub('___teamManagerBinding') }
						playerChoosersTabsModel = { this.playerChoosersTabsModel }
						actions 				= { this.teamManagerActions }
					/>
					<div className="eManager_group">
						<div className="eTeam_errorBox">
							{typeof binding.toJS('error') !== 'undefined' ? binding.get('error.text') : ''}
						</div>
					</div>
					<div className="eForm_savePanel">
						<div className="bButton mRight" id="team_submit" onClick={self.props.onFormSubmit}>Finish</div>
					</div>
				</div>
			);
		} else {
			return null;
		}
	},
	render: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return (
			<div className="bManager mTeamForm">
				<h2>{self.props.title}</h2>

				<div className="eManager_base">
					<div className="eManager_group">
						<div className="eManager_label">{'Team Name'}</div>
						<input
							ref="name"
							className="eManager_field mWide"
							type="text"
							id="team_name"
							value={binding.get('name')}
							placeholder={'enter name'}
							onChange={self.handleChangeName}
							onBlur={() => binding.set('nameCursor',-1)} //for block the installation of the cursor after a loss of focus.
						/>
					</div>
					<div className="eManager_group">
						<div className="eManager_label">{'Team Description'}</div>
						<textarea
							ref="description"
							className="eManager_field mTextArea mHigh mWide"
							type="text"
							id="team_description"
							value={binding.get('description')}
							placeholder={'enter description'}
							onChange={self.handleChangeDescription}
							onBlur={() => binding.set('descriptionCursor',-1)}	//for block the installation of the cursor after a loss of focus.
						/>
					</div>
					<div className="eManager_group">
						<div className="eManager_label">{'Game'}</div>
						<select
							id			= "team_sportSelect"
							className	= "eManager_select mWide"
							value		= {binding.toJS('sportId')}
							onChange	= {self.handleChangeSport}
						>
							{self.getSports()}
						</select>
					</div>
					<div className="eManager_group">
						<div className="eManager_label">{'Genders'}</div>
						<select
							id			= "team_gender_select"
							className	= {
								classNames({
									eManager_select:	true,
									mWide:				true,
									mDisabled:			!self.isSportSelected()
								})
							}
							onChange	= {self.handleChangeGender}
							disabled	= {!self.isSportSelected()}
						>
							{self.getGenders()}
						</select>
					</div>
					<div className="eManager_group">
						<div className="eManager_label">
							Ages
						</div>
						<div className="bMultiSelectDropdownWrapper">
							<MultiselectDropdown
								items			= {this._getAges()}
								selectedItems	= {this._getSelectedAges()}
								handleClickItem	= {this._handleChangeAges}
							/>
						</div>
					</div>
					<div className="eManager_group">
						<div className="eManager_label">{'Filtered By House'}</div>
						<div className="eManager_radiogroup">
							{self.renderHouseFilterCheckbox()}
						</div>
					</div>
					<If condition={self.getHouseFilterCheckboxValue()}>
						<div className="eManager_group">
							<div className="eManager_label">{'House'}</div>
							<div className="eManager_select_wrap">
								{self.renderHouseAutocomplete()}
							</div>
						</div>
					</If>
					{self.renderTeamManager()}
				</div>
			</div>
		);
	}
});

module.exports = TeamForm;