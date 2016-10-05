const	React			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		If				= require('module/ui/if/if'),
		Autocomplete	= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		Multiselect		= require('module/ui/multiselect/multiselect'),
		EventVenue		= require('./event_venue'),
		DateHelper		= require('./../../../../helpers/date_helper'),
		classNames		= require('classnames');

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
    changeCompleteType: function (event) {
        const   self        = this,
                binding     = self.getDefaultBinding(),
                type        = event.target.value,
                schoolInfo  = binding.get('schoolInfo');

        let     rivals = Immutable.List();

		switch (type) {
			case 'inter-schools':
				rivals = rivals.push(binding.get('schoolInfo'));
				break;
			case 'internal':
				rivals = Immutable.fromJS([
					{
						id: null,
						name: ''
					},
					{
						id: null,
						name: ''
					}
				]);
				break;
		}

        binding
            .atomically()
            .set('rivals', Immutable.fromJS(rivals))
            .set('model.type', Immutable.fromJS(type))
            .set('autocomplete', Immutable.Map())
            .commit();
    },
	changeCompleteSport: function (event) {
		var self = this,
            binding = self.getDefaultBinding(),
            sportsBinding = self.getBinding('sports'),
            sportId = event.target.value,
            sportIndex = sportsBinding.get('models').findIndex(function(model) {
                return model.get('id') === sportId;
            });

		binding
            .atomically()
            .set('model.sportId',    event.target.value)
            .set('model.sportModel', sportsBinding.get(`models.${sportIndex}`))
            .set('model.gender',     sportsBinding.get(`models.${sportIndex}.gender.0`))
            .commit();
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
				<option	value=	{sport.id}
						key=	{sport.id}
				>
					{sport.name}
				</option>
			);
        });
    },
	handleChangeGenderSelect: function(binding, eventDescriptor) {
		binding.set('model.gender', Immutable.fromJS(eventDescriptor.target.value));
	},
	getGenderSelectOptions: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const sportModel = binding.get('model.sportModel');

		let genderOptions = [];

		//if sport was selected
		if(self.isSportSelected()) {
			genderOptions.push((
				<option	key="not-selected-gender"
						   value={undefined}
						   disabled="disabled"
						   selected="selected"
				>
					Please select
				</option>
			));
		} else {
			genderOptions.push((
				<option	key="not-selected-gender"
						   value={undefined}
						   disabled="disabled"
						   selected="selected"
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
                gender  = binding.get('model.gender'),
                type    = binding.get('model.type');

		return(
			<div className="eManager_base">
				<div className="eManager_group">
					<div className="eManager_label">{'Date'}</div>
					<Morearty.DOM.input
						className="eManager_field"
						type="text"
						value={self.getEventDate(binding.get('model.startTime'))}
						disabled={'disabled'}
						/>
				</div>
				<div className="eManager_group">
					<div className="eManager_label">{'Time'}</div>
					<Morearty.DOM.input
						className="eManager_field"
						type="text"
						value={self.getEventTime(binding.get('model.startTime'))}
						disabled={'disabled'}
						/>
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
						<select	className="eManager_select"
								value={sportId}
								onChange={self.changeCompleteSport}
						>
							<option	key="not-selected-sport"
									value={undefined}
									disabled="disabled"
									selected="selected"
							>
								Please select
							</option>
							{self.getSports()}
						</select>
				</div>
				<div className="eManager_group">
					<div className="eManager_label">{'Genders'}</div>
					<select	className={classNames({eManager_select: true, mDisabled: !self.isSportSelected()})}
							value={gender}
							onChange={self.handleChangeGenderSelect.bind(self, binding)}
							disabled={!self.isSportSelected()}
					>
						{self.getGenderSelectOptions()}
					</select>
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
					<div className="eManager_label">{'Game Type'}</div>
						<select	className="eManager_select"
								value={binding.toJS('model.type')}
								onChange={self.changeCompleteType}>
							<option	key="not-selected-game-type"
									value={undefined}
									disabled="disabled"
									selected="selected"
							>
								Please select
							</option>
							<option	key="inter-schools-type"
									value="inter-schools"
							>
								Inter-schools
							</option>
							<option	key="houses-type"
									value="houses"
							>
								Houses
							</option>
							<option	key="anyway-type"
									value="internal"
							>
								Internal
							</option>
						</select>
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
