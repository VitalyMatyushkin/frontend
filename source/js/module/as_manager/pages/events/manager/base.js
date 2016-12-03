const	React							= require('react'),
		Morearty						= require('morearty'),
		Immutable						= require('immutable'),

		If								= require('module/ui/if/if'),
		Autocomplete					= require('./../../../../ui/autocomplete2/OldAutocompleteWrapper'),
		EventVenue						= require('./event_venue'),
		TimeInputWrapper				= require('./time_input_wrapper'),

		DateSelectorWrapper				= require('./manager_components/date_selector/date_selector_wrapper'),
		GenderSelectorWrapper			= require('./manager_components/gender_selector/gender_selector_wrapper'),
		GameTypeSelectorWrapper			= require('./manager_components/game_type_selector/game_type_selector_wrapper'),
		AgeMultiselectDropdownWrapper	= require('./manager_components/age_multiselect_dropdown/age_multiselect_dropdown_wrapper'),

		InputWrapperStyles				= require('./../../../../../../styles/ui/b_input_wrapper.scss'),
		InputLabelStyles				= require('./../../../../../../styles/ui/b_input_label.scss'),
		TextInputStyles					= require('./../../../../../../styles/ui/b_text_input.scss'),
		DropdownStyles					= require('./../../../../../../styles/ui/b_dropdown.scss'),
		HouseAutocompleteWrapper		= require('./../../../../../../styles/ui/b_house_autocomplete_wrapper.scss');

const EventManagerBase = React.createClass({
	mixins: [Morearty.Mixin],
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
    /**
     * School filtering service
     * @param schoolName
     * @returns {*}
     */
    serviceSchoolFilter: function(schoolName) {
        const   self        = this,
                binding     = self.getDefaultBinding(),
                schoolId    = binding.get('schoolInfo.id');

        const filter = {
            filter: {
                where: {
					id: {
						$nin: [schoolId]
					},
                    name: { like: schoolName }
                },
				order:"name ASC",
                limit: 400
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
        		sports	= self.getBinding('sports').toJS();

        return sports.models.map(sport => {
			return (
				<option	value	= { sport.id }
						key		= { sport.id }
				>
					{sport.name}
				</option>
			);
        });
    },

	render: function() {
		const   self                = this,
                binding             = self.getDefaultBinding(),
                activeSchoolName    = binding.get('schoolInfo.name'),
                sportId             = binding.get('model.sportId'),
                services = {
                    'inter-schools':    self.serviceSchoolFilter,
                    'houses':           self.serviceHouseFilter,
                    'internal':         self.serviceClassFilter
                },
                type    = binding.get('model.type');

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
						Event Name
					</div>
					<Morearty.DOM.input
						className	= "bTextInput"
						type		= "text"
						value		= {binding.get('model.name')}
						placeholder	= {'enter name'}
						onChange	= {Morearty.Callback.set(binding.sub('model.name'))}
					/>
				</div>
				<div className="bInputWrapper">
					<div className="bInputLabel">
						Game
					</div>
						<select	className		= "bDropdown"
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
				<div className="bInputWrapper">
					{type === 'inter-schools' ? <div className="bInputLabel">Choose school</div> : null}
					<If	condition	= {type === 'inter-schools'}
						key			= {'if-choose-school'}
					>
						<Autocomplete	defaultItem		= {binding.toJS('rivals.1')}
										serviceFilter	= {services[type]}
										serverField		= "name"
										placeholder		= "enter school name"
										onSelect		= {self.onSelectRival.bind(null, 1)}
										binding			= {binding.sub('autocomplete.inter-schools.0')}
										extraCssStyle	= "mBigSize"
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
									extraCssStyle	= {'mBigSize'}
								/>
							</div>
							<Autocomplete
								defaultItem		= {binding.toJS('rivals.1')}
								serviceFilter	= {self.serviceHouseFilter.bind(null, 1)}
								serverField		= "name"
								placeholder		= "Select the second house"
								onSelect		= {self.onSelectRival.bind(null, 1)}
								binding			= {binding.sub('autocomplete.houses.1')}
								extraCssStyle	= {'mBigSize'}
							/>
						</div>
					</If>
				</div>
				<EventVenue binding={binding}/>
			</div>
		);
	}
});

module.exports = EventManagerBase;
