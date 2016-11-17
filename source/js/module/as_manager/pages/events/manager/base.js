const	React					= require('react'),
		Morearty				= require('morearty'),
		Immutable				= require('immutable'),

		If						= require('module/ui/if/if'),
		Autocomplete			= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		Multiselect				= require('module/ui/multiselect/multiselect'),
		EventVenue				= require('./event_venue'),
		DateHelper				= require('./../../../../helpers/date_helper'),
		TimeInputWrapper		= require('./time_input_wrapper'),
		classNames				= require('classnames'),

		DateSelectorWrapper		= require('./manager_components/date_selector/date_selector_wrapper'),
		GenderSelectorWrapper	= require('./manager_components/gender_selector/gender_selector_wrapper'),
		GameTypeSelectorWrapper	= require('./manager_components/game_type_selector/game_type_selector_wrapper');

const EventManagerBase = React.createClass({
	mixins: [Morearty.Mixin],
    isSportSelected: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		return !!binding.toJS('model.sportId');
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
			case sportModel.genders.maleOnly:
				return 'maleOnly';
			case sportModel.genders.femaleOnly:
				return 'femaleOnly';
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
    getAges: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            ages = binding.toJS('model.ages'),
            availableAges = binding.get('availableAges');

        return availableAges.sort().filter(function (age) {
            return ages === null || ages.indexOf(age) === -1;
        }).map(function (age) {
            return <Morearty.DOM.option
                key={age + '-ages'}
                value={age}>{'Y' + age}</Morearty.DOM.option>;
        });

    },
    getEventDate: function(date) {
        return DateHelper.getDateStringFromDateObject(date);
    },
    getEventTime: function(date) {
		return DateHelper.getTimeStringFromDateObject(date);
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
				<div className="eManager_group">
					<div className="eManager_label">{'Time'}</div>
					<TimeInputWrapper binding={binding.sub('model.startTime')}/>
				</div>
				<div className="eManager_group">
					<div className="eManager_label">{'Event Name'}</div>
					<Morearty.DOM.input
						className="eManager_field"
						type="text"
						value={binding.get('model.name')}
						placeholder={'enter name'}
						onChange={Morearty.Callback.set(binding.sub('model.name'))}
					/>
				</div>
				<div className="eManager_group">
					<div className="eManager_label">{'Event Description'}</div>
					<Morearty.DOM.textarea
						className="eManager_field mTextArea"
						type="text"
						value={binding.get('model.description')}
						placeholder={'enter description'}
						onChange={Morearty.Callback.set(binding.sub('model.description'))}
					/>
				</div>
				<div className="eManager_group">
					<div className="eManager_label">{'Game'}</div>
						<select	className		= "eManager_select"
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
				<div className="eManager_group">
					<div className="eManager_label">{'Genders'}</div>
					<GenderSelectorWrapper	binding={binding}/>
				</div>
				<div className="eManager_group">
					<div className="eManager_label">{'Ages'}</div>
					<Multiselect
						binding={binding}
						items={
							binding.get('availableAges').sort((f,l)=>{
								return f - l;
							}).map(function (age) {
								return {
									id: age,
									text: 'Y' + age
								};
							}).toJS()
						}
						selections={binding.toJS('model.ages')}
						onChange={self.changeCompleteAges}
					/>
				</div>
				<div className="eManager_group">
					<div className="eManager_label">
						{'Game Type'}
					</div>
					<GameTypeSelectorWrapper binding={binding}/>
				</div>
				<If condition={!!type}>
					<div>
						<div className="eManager_group">
							{type === 'inter-schools' ? <div className="eManager_label">Choose school</div> : null}
							<If condition={type === 'inter-schools'} key={'if-choose-school'}>
								<div>
									<Autocomplete
										defaultItem={binding.toJS('rivals.1')}
										serviceFilter={services[type]}
										serverField="name"
										placeholderText={'enter school name'}
										onSelect={self.onSelectRival.bind(null, 1)}
										binding={binding.sub('autocomplete.inter-schools.0')}
									/>
								</div>
							</If>
							{type === 'houses' ? <div className="eManager_label">Choose houses</div> : null}
							<If condition={type === 'houses'}>
								<div className="eChooseHouses">
									<Autocomplete
										defaultItem={binding.toJS('rivals.0')}
										serviceFilter={self.serviceHouseFilter.bind(null, 0)}
										serverField="name"
										placeholderText={'Select the first house'}
										onSelect={self.onSelectRival.bind(null, 0)}
										binding={binding.sub('autocomplete.houses.0')}
									/>
									<div className="eChoose_vs">vs</div>
									<Autocomplete
										defaultItem={binding.toJS('rivals.1')}
										serviceFilter={self.serviceHouseFilter.bind(null, 1)}
										serverField="name"
										placeholderText={'Select the second house'}
										onSelect={self.onSelectRival.bind(null, 1)}
										binding={binding.sub('autocomplete.houses.1')}
									/>
								</div>
							</If>
						</div>
						<div className="eManager_group">
							<EventVenue binding={binding}/>
						</div>
					</div>
				</If>
			</div>
		);
	}
});

module.exports = EventManagerBase;
