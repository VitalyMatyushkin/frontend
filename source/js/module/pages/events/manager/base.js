var Autocomplete = require('module/ui/autocomplete/autocomplete'),
    If = require('module/ui/if/if'),
    EventManagerBase;

EventManagerBase = React.createClass({
	mixins: [Morearty.Mixin],
    /**
     * Сервис фильтрации по дому
     * @param houseName
     * @returns {*}
     */
    serviceHouseFilter: function(schoolId, houseName) {
        var self = this,
            ids = self.getDefaultBinding().get('autocomplete.houses').toArray().map(function (house) {
				return house.get('selectedId');
			});

        return window.Server.housesFilter.get({
            filter: {
                where: {
                    schoolId: schoolId,
                    id: {
                        nin: ids
                    },
                    name: {
                        like: houseName,
                        options: 'i'
                    }
                }
            }
        });
    },
    /**
     * Сервис фильтрации по классу
     * @param className
     * @returns {*}
     */
    serviceClassFilter: function(schoolId, className) {
        var self = this,
			ids = self.getDefaultBinding().get('autocomplete.classes').toArray().map(function (_class) {
				return _class.get('selectedId');
			});

        return window.Server.formsFilter.get({
            filter: {
                where: {
                    schoolId: schoolId,
                    id: {
                      nin: ids
                    },
                    name: {
                        like: className,
                        options: 'i'
                    }
                }
            }
        });
    },
    /**
     * Сервис фильтрации по школе
     * @param schoolName
     * @returns {*}
     */
    serviceSchoolFilter: function(schoolId, schoolName) {
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            userId = rootBinding.get('userData.authorizationInfo.userId');

        return window.Server.schools.get({
            filter: {
                where: {
                    id: {
                        neq: schoolId
                    },
                    ownerId: {
                        neq: userId
                    },
                    name: {
                        like: schoolName,
                        options: 'i'
                    }
                }
            }
        });
    },
    changeCompleteType: function (event) {
        var self = this,
            binding = self.getDefaultBinding(),
            type = event.target.value,
            rootBinding = self.getMoreartyContext().getBinding(),
            schoolInfo = rootBinding.get('schoolInfo'),
            rivals = Immutable.List();

        if (type === 'inter-schools') {
            rivals = rivals.push(rootBinding.get('schoolInfo'));
        } else if (type === 'internal') {
            rivals = Immutable.fromJS([
                {
                    name: ''
                },
                {
                    name: ''
                }
            ]);
        }

        binding
            .atomically()
            .set('rivals', rivals)
            .set('model.type', type)
            .set('autocomplete', Immutable.Map())
            .commit();
    },
    changeCompleteGender: function (event) {
        var binding = this.getDefaultBinding();

        binding.set('model.gender', event.target.value);
    },
	changeCompleteSport: function (event) {
		var binding = this.getDefaultBinding();

		binding.set('model.sportId', event.target.value);
	},
	onSelectRival: function (id, response, model) {
		var self = this,
			binding = self.getDefaultBinding();

		if (model) {
			binding.update('rivals', function (rivals) {
				var found = rivals.filter(function (rival) {
					return rival.get('id') === id;
				});

				if (found.count() === 0) {
					return rivals.push(Immutable.fromJS(model));
				} else {
					return rivals;
				}
			});
		}
	},
    getSports: function () {
        var self = this,
            sportsBinding = self.getBinding('sports');

        return sportsBinding.get('models').map(function (sport) {
            return <Morearty.DOM.option
				selected={sport.get('name') === 'football'}
                value={sport.get('id')}
				key={sport.get('id') + '-sport'}
			>{sport.get('name')}</Morearty.DOM.option>
        }).toArray();
    },
    getGenders: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            sportId = binding.get('model.sportId'),
            sportsBinding = self.getBinding('sports'),
            sport = sportsBinding.get('models').find(function (sport) {
                return sport.get('id') === sportId;
            });

        if (sport) {
            return sport.toJS().limits.genders.map(function (gender) {
                var names = {
                    male: 'boys',
                    female: 'girls'
                };

                return <Morearty.DOM.option key={gender + '-gender'} value={gender}>{names[gender]}</Morearty.DOM.option>;
            });
        } else {
            return null;
        }
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
            activeSchoolName = rootBinding.get('schoolInfo.name'),
			sportId = binding.get('model.sportId'),
            services = {
                'inter-schools': self.serviceSchoolFilter.bind(self, activeSchoolId),
                'houses': self.serviceHouseFilter.bind(self, activeSchoolId),
                'internal': self.serviceClassFilter.bind(self, activeSchoolId)
            },
            gender = binding.get('model.gender'),
            type = binding.get('model.type');

		return <div className="eManager_base">
            <div className="eManager_group">
                {'Event Name'}
                <Morearty.DOM.input
                    className="eManager_field"
                    type="text"
                    value={binding.get('model.name')}
                    placeholder={'enter name'}
                    onChange={Morearty.Callback.set(binding.sub('model.name'))}
                />
            </div>
            <If condition={!!binding.get('model.name')}>
                <div className="eManager_group">
                    {'Event Description'}
                    <Morearty.DOM.textarea
                        className="eManager_field mTextArea"
                        type="text"
                        value={binding.get('model.description')}
                        placeholder={'enter description'}
                        onChange={Morearty.Callback.set(binding.sub('model.description'))}
                    />
                </div>
            </If>
            <If condition={!!binding.get('model.name')}>
                <div className="eManager_group">
                    {'Game'}
                    <select
                        className="eManager_select"
                        value={sportId}
                        defaultValue={null}
                        onChange={self.changeCompleteSport}>
                        <Morearty.DOM.option
                            key="nullable-type"
                            value={null}>not selected</Morearty.DOM.option>
                        {self.getSports()}
                    </select>
                </div>
            </If>
            <If condition={!!binding.get('model.sportId')}>
                <div className="eManager_group">
                    {'Gender'}
                    <select
                        className="eManager_select"
                        defaultValue="male"
                        value={gender}
                        onChange={self.changeCompleteGender}>
                        {self.getGenders()}
                    </select>
                </div>
            </If>
            <If condition={!!binding.get('model.sportId')}>
                <div className="eManager_group">
                    {'Game Type'}
                    <select
                        className="eManager_select"
                        defaultValue={null}
                        value={type}
                        onChange={self.changeCompleteType}>
                        <Morearty.DOM.option key="nullable-type" value={null}>not selectable</Morearty.DOM.option>
                        <Morearty.DOM.option key="inter-schools-type" value="inter-schools">inter-schools</Morearty.DOM.option>
                        <Morearty.DOM.option key="houses-type" value="houses">houses</Morearty.DOM.option>
                        <Morearty.DOM.option key="anyway-type" value="internal">internal</Morearty.DOM.option>
                    </select>
                </div>
            </If>
            <div className="eManager_group">
                {type === 'inter-schools' ? 'Choose school' : null}
                <If condition={type === 'inter-schools'} key={'if-choose-school'}>
                    <div>
                        <input
                            key="firstSchool"
                            disabled="disabled"
                            value={activeSchoolName}
                            type="text"
                            className="eManager_eField" />
                        <Autocomplete
                            serviceFilter={services[type]}
                            serverField="name"
                            placeholderText={'enter school name'}
                            onSelect={self.onSelectRival}
                            binding={binding.sub('autocomplete.inter-schools.0')}
                        />
                    </div>
                </If>
                {type === 'houses' ? 'Choose houses' : null}
                <If condition={type === 'houses'}>
                    <div>
                        <Autocomplete
                            serviceFilter={services[type]}
                            serverField="name"
                            placeholderText={'enter the first house name'}
                            onSelect={self.onSelectRival}
                            binding={binding.sub('autocomplete.houses.0')}
                        />
                        <Autocomplete
                            serviceFilter={services[type]}
                            serverField="name"
                            placeholderText={'enter the second house name'}
                            onSelect={self.onSelectRival}
                            binding={binding.sub('autocomplete.houses.1')}
                        />
                    </div>
                </If>
                {type === 'internal' ? 'Create a team' : null}
                <If condition={type === 'internal'}>
                    <div>
                        <input
                            key="firstTeam"
                            type="text"
                            placeholder="Enter the first team name"
                            value={binding.get('rivals.0.name')}
                            onChange={Morearty.Callback.set(binding.sub('rivals.0.name'))}
                            className="eManager_eField" />
                        <input
                            key="secondTeam"
                            type="text"
                            placeholder="Enter the second team name"
                            value={binding.get('rivals.1.name')}
                            onChange={Morearty.Callback.set(binding.sub('rivals.1.name'))}
                            className="eManager_eField" />
                    </div>
                </If>
            </div>
        </div>;
	}
});


module.exports = EventManagerBase;
