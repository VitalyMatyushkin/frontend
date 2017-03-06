const	React							= require('react'),
		Morearty						= require('morearty'),
		Immutable						= require('immutable');

const	If								= require('../../../../ui/if/if'),
		Autocomplete					= require('../../../../ui/autocomplete2/OldAutocompleteWrapper'),
		SchoolItemList					= require('../../../../ui/autocomplete2/custom_list_items/school_list_item/school_list_item'),
		EventVenue						= require('./event_venue'),
		TimeInputWrapper				= require('./time_input_wrapper');

const	DateSelectorWrapper				= require('./manager_components/date_selector/date_selector_wrapper'),
		GenderSelectorWrapper			= require('./manager_components/gender_selector/gender_selector_wrapper'),
		GameTypeSelectorWrapper			= require('./manager_components/game_type_selector/game_type_selector_wrapper'),
		AgeMultiselectDropdownWrapper	= require('./manager_components/age_multiselect_dropdown/age_multiselect_dropdown_wrapper');

const	EventHelper						= require('../eventHelper');

const	InputWrapperStyles				= require('./../../../../../../styles/ui/b_input_wrapper.scss'),
		InputLabelStyles				= require('./../../../../../../styles/ui/b_input_label.scss'),
		TextInputStyles					= require('./../../../../../../styles/ui/b_text_input.scss'),
		DropdownStyles					= require('./../../../../../../styles/ui/b_dropdown.scss'),
		HouseAutocompleteStyle			= require('./../../../../../../styles/ui/b_house_autocomplete_wrapper.scss'),
		SmallCheckboxBlockStyle			= require('./../../../../../../styles/ui/b_small_checkbox_block.scss');

const EventForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		isCopyMode : React.PropTypes.bool
	},
	componentWillMount: function() {
		const binding = this.getDefaultBinding();

		const isSchoolHaveFavoriteSports = this.isSchoolHaveFavoriteSports();

		binding.atomically()
			.set('isShowAllSports', !isSchoolHaveFavoriteSports )
			.set('isSchoolHaveFavoriteSports', isSchoolHaveFavoriteSports)
			.set('eventFormOpponentSchoolKey', Immutable.fromJS(this.generateOpponentSchoolInputKey()))
			.set('eventFormSportSelectorKey', Immutable.fromJS(this.generateSportSelectorKey()))
			.commit();
	},
	generateOpponentSchoolInputKey: function() {
		// just current date in timestamp view
		return + new Date();
	},
	generateSportSelectorKey: function() {
		// just current date in timestamp view
		return + new Date();
	},
	/**
	 * House filtering service...
	 * @param houseName
	 * @returns {*}
	 */
	serviceHouseFilter: function(order, houseName) {
		const	self		= this,
				binding		= self.getDefaultBinding(),
				schoolId	= binding.get('schoolInfo.id');

		const filter = {
			where: {
				name: {
					like: houseName,
					options: 'i'
				}
			},
			order:'name ASC'
		};

		const otherHouseId = self._getOtherHouseId(order);

		if(otherHouseId !== undefined && otherHouseId !== null) {
			filter.where.id = {
				$nin: [otherHouseId]
			};
		}

		return window.Server.schoolHouses.get(
			{
				schoolId: schoolId,
				filter: filter
			}
		);
	},
	/**
	 * Get house ID from other autocomplete
	 * @param currHouseIndex -
	 * @private
	 */
	_getOtherHouseId: function(currHouseIndex) {
		const	self		= this,
				binding		= self.getDefaultBinding();
		let		otherHouseId;

		switch (currHouseIndex) {
			case 0:
				otherHouseId = binding.toJS('rivals.1.id');
				break;
			case 1:
				otherHouseId = binding.toJS('rivals.0.id');
				break;
		}

		return otherHouseId;
	},
	getMainSchoolFilter: function(activeSchoolId, schoolName) {
		return {
			filter: {
				where: {
					id: {
						$nin: [activeSchoolId]
					},
					name: { like: schoolName }
				},
				limit: 20
			}
		};
	},
	getMainGeoSchoolFilterByParams: function(fartherThenValue, point) {
		const milesToMeters = 1609.344;
		switch (fartherThenValue) {
			case "UNLIMITED":
				return {
					$nearSphere: {
						$geometry: {
							type: 'Point',
							coordinates: [point.lng, point.lat] // [longitude, latitude]
						}
					}
				};
			default:
				return {
					$nearSphere: {
						$geometry: {
							type: 'Point',
							coordinates: [point.lng, point.lat] // [longitude, latitude]
						},
						$maxDistance: EventHelper.fartherThenItems.find(i => i.id === fartherThenValue).value * milesToMeters // 20 miles in meters
					}
				};
		}
	},
	/**
	 * School filtering service
	 * @param schoolName
	 * @returns {*}
	 */
	schoolService: function(schoolName) {
		const binding = this.getDefaultBinding();

		const	activeSchool			= binding.toJS('schoolInfo'),
				activeSchoolId			= activeSchool.id,
				activeSchoolPostcode	= activeSchool.postcode,
				fartherThen				= binding.toJS('fartherThen');

		const filter = this.getMainSchoolFilter(activeSchoolId, schoolName);
		if(typeof activeSchoolPostcode !== 'undefined') {
			const point = activeSchoolPostcode.point;
			filter.filter['postcode.point'] = this.getMainGeoSchoolFilterByParams(fartherThen, point);
		} else {
			filter.filter.order = "name ASC";
		}

		let schools;
		return window.Server.publicSchools.get(filter)
			.then(_schools => {
				schools = _schools;

				return this.getTBDSchool();
			})
			.then(data => {
				if(data.length > 0 && data[0].name === "TBD") {
					// set TBD school at first
					schools.unshift(data[0]);
				}
				return schools;
			});
	},
	getTBDSchool: function() {
		const filter = {
			filter: {
				where: {
					name: { like: "TBD" }
				}
			}
		};
		return window.Server.publicSchools.get(filter);
	},
	changeCompleteSport: function (event) {
		var self = this,
			binding = self.getDefaultBinding(),
			sportsBinding = self.getBinding('sports'),
			sportId = event.target.value,
			sportIndex = sportsBinding.get('models').findIndex(function(model) {
				return model.get('id') === sportId;
			});

		const sportModel = sportsBinding.get(`models.${sportIndex}`).toJS();

		binding.atomically()
			.set('model.sportId',    event.target.value)
			.set('model.sportModel', Immutable.fromJS(sportModel))
			.set('model.gender',     Immutable.fromJS(this.getDefaultGender(sportModel)))
			.commit();
	},
	handleChangeFartherThan: function (eventDescriptor) {
		const binding = this.getDefaultBinding();

		binding.atomically()
			.set('rivals.1',					undefined)
			.set('eventFormOpponentSchoolKey',	Immutable.fromJS(this.generateOpponentSchoolInputKey()))
			.set('fartherThen',					eventDescriptor.target.value)
			.commit();
	},
	getDefaultGender: function(sportModel) {
		switch (true) {
			case sportModel.genders.maleOnly && sportModel.genders.femaleOnly && sportModel.genders.mixed:
				return undefined;
			case sportModel.genders.maleOnly && sportModel.genders.femaleOnly && !sportModel.genders.mixed:
				return undefined;
			case sportModel.genders.femaleOnly:
				return 'femaleOnly';
			case sportModel.genders.maleOnly:
				return 'maleOnly';
			case sportModel.genders.mixed:
				return undefined;
		}
	},
	changeCompleteAges: function (selections) {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('model.ages', Immutable.fromJS(selections));
	},
	onSelectRival: function (order, id, model) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		if (typeof id !== 'undefined' && typeof model !== 'undefined') {
			binding.set(`rivals.${order}`, Immutable.fromJS(model));
		}
	},
	getSports: function () {
		const	self	= this,
				binding	= this.getDefaultBinding(),
				sports	= self.getBinding('sports').toJS();

		const isSchoolHaveFavoriteSports = binding.get('isSchoolHaveFavoriteSports');

		return sports.models.filter(sport => {
			switch (true) {
				case !isSchoolHaveFavoriteSports:
					return true;
				case binding.get('isShowAllSports'):
					return true;
				default:
					return sport.isFavorite;
			}
		}).map(sport => {
			return (
				<option	value	= { sport.id }
						key		= { sport.id }
				>
					{sport.name}
				</option>
			);
		});
	},
	getFartherThenItems: function () {
		const	self	= this,
				sports	= self.getBinding('sports').toJS();

		return EventHelper.fartherThenItems.map(item => {
			return (
				<option	value	= { item.id }
						key		= { item.id }
				>
					{item.text}
				</option>
			);
		});
	},
	isSchoolHaveFavoriteSports: function() {
		const sports = this.getBinding('sports').toJS().models;

		return sports.filter(s => s.isFavorite).length > 0;
	},
	handleChangeShowAllSports: function() {
		const binding = this.getDefaultBinding();

		const isShowAllSports = binding.get('isShowAllSports'),
			currentSport = binding.toJS('model.sportModel');

		// so, if isShowAllSports was true, now it's false
		// and it means that we should clear sportId if that sport isn't favorite.
		if(isShowAllSports && !currentSport.isFavorite) {
			binding.atomically()
				.set('model.sportModel', Immutable.fromJS(undefined))
				.set('model.sportId', Immutable.fromJS(undefined))
				.set('isShowAllSports', !isShowAllSports)
				.set('eventFormSportSelectorKey', Immutable.fromJS(this.generateSportSelectorKey()))
				.commit()
		} else {
			binding.atomically()
				.set('isShowAllSports', !isShowAllSports)
				.set('eventFormSportSelectorKey', Immutable.fromJS(this.generateSportSelectorKey()))
				.commit()
		}
	},
	render: function() {
		const self = this,
			binding = self.getDefaultBinding();

		const	sportId						= binding.get('model.sportId'),
				isShowAllSports				= binding.get('model.isShowAllSports'),
				fartherThen					= binding.get('fartherThen'),
				isSchoolHaveFavoriteSports	= binding.get('isSchoolHaveFavoriteSports'),
				services					= {
					'inter-schools': self.schoolService,
					'houses': self.serviceHouseFilter
				},
				type						= binding.get('model.type');

		return(
			<div className="eManager_base">
				<DateSelectorWrapper binding={binding.sub('model.startTime')}/>
				<div className="bInputWrapper">
					<div className="bInputLabel">
						Time
					</div>
					<TimeInputWrapper binding={binding.sub('model.startTime')}/>
				</div>
				<div className="bInputWrapper">
					<div className="bInputLabel">
						Game
					</div>
						<select	key				= {binding.toJS('eventFormSportSelectorKey')}
								className		= "bDropdown"
								defaultValue	= "not-selected-sport"
								value			= {sportId}
								onChange		= {self.changeCompleteSport}
						>
							<option	key			= "not-selected-sport"
									value		= "not-selected-sport"
									disabled	= "disabled"
							>
								Please select
							</option>
							{self.getSports()}
						</select>
						<If condition={isSchoolHaveFavoriteSports}>
							<div className="bSmallCheckboxBlock">
								<div className="eSmallCheckboxBlock_label">
									Show all sports
								</div>
								<div className="eForm_fieldInput">
									<input className="eSwitch" type="checkbox" checked={isShowAllSports} onChange={this.handleChangeShowAllSports} />
									<label/>
								</div>
							</div>
						</If>
				</div>
				<div className="bInputWrapper">
					<div className="bInputLabel">
						Genders
					</div>
					<GenderSelectorWrapper binding={binding}/>
				</div>
				<div className="bInputWrapper">
					<div className="bInputLabel">
						Ages
					</div>
					<AgeMultiselectDropdownWrapper binding={binding}/>
				</div>
				<div className="bInputWrapper">
					<div className="bInputLabel">
						Game Type
					</div>
					<GameTypeSelectorWrapper binding={binding}/>
				</div>
				<If	condition	= {type === 'inter-schools'}
					key			= {'if-farther-then'}
				>
					<div className="bInputWrapper">
						<div className="bInputLabel">
							Not farther than
						</div>
						<select	className		= "bDropdown"
								defaultValue	= {EventHelper.fartherThenItems[0].id}
								value			= {fartherThen}
								onChange		= {self.handleChangeFartherThan}
						>
							{self.getFartherThenItems()}
						</select>
					</div>
				</If>
				<div className="bInputWrapper">
					{type === 'inter-schools' ? <div className="bInputLabel">Choose school</div> : null}
					<If	condition	= {type === 'inter-schools'}
						key			= {'if-choose-school'}
					>
						<Autocomplete	key				= {binding.toJS('eventFormOpponentSchoolKey')}
										defaultItem		= {binding.toJS('rivals.1')}
										serviceFilter	= {services[type]}
										serverField		= "name"
										placeholder		= "enter school name"
										onSelect		= {self.onSelectRival.bind(null, 1)}
										binding			= {binding.sub('autocomplete.inter-schools.0')}
										extraCssStyle	= "mBigSize mWhiteBG"
										customListItem	= {SchoolItemList}
						/>
					</If>
					{type === 'houses' ? <div className="bInputLabel">Choose houses</div> : null}
					<If condition={type === 'houses'}>
						<div>
							<div className="bHouseAutocompleteWrapper">
								<Autocomplete
									defaultItem		= {binding.toJS('rivals.0')}
									serviceFilter	= {self.serviceHouseFilter.bind(null, 0)}
									serverField		= "name"
									placeholder		= {'Select the first house'}
									onSelect		= {self.onSelectRival.bind(null, 0)}
									binding			= {binding.sub('autocomplete.houses.0')}
									extraCssStyle	= {'mBigSize mWhiteBG'}
								/>
							</div>
							<Autocomplete
								defaultItem		= {binding.toJS('rivals.1')}
								serviceFilter	= {self.serviceHouseFilter.bind(null, 1)}
								serverField		= "name"
								placeholder		= "Select the second house"
								onSelect		= {self.onSelectRival.bind(null, 1)}
								binding			= {binding.sub('autocomplete.houses.1')}
								extraCssStyle	= {'mBigSize mWhiteBG'}
							/>
						</div>
					</If>
				</div>
				<EventVenue	binding				= {binding}
							eventType			= {binding.toJS('model.type')}
							activeSchoolInfo	= {binding.toJS('schoolInfo')}
							opponentSchoolInfo	= {binding.toJS('rivals.1')}
							isCopyMode			= {this.props.isCopyMode}
				/>
			</div>
		);
	}
});

module.exports = EventForm;