const   Autocomplete 	= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
        If              = require('module/ui/if/if'),
        Multiselect     = require('module/ui/multiselect/multiselect'),
        React           = require('react'),
        ReactDOM        = require('reactDom'),
        EventVenue      = require('./event_venue'),
        Immutable       = require('immutable'),
        SVG 		        = require('module/ui/svg');

const EventManagerBase = React.createClass({
	mixins: [Morearty.Mixin],
    /**
     * Сервис фильтрации по дому
     * @param houseName
     * @returns {*}
     */
    serviceHouseFilter: function(houseName) {
        const   binding     = this.getDefaultBinding(),
                schoolId    = binding.get('schoolInfo.id');
                //ids         = binding.get('autocomplete.houses').toArray().map(house => {
                //    console.log(`houses: ${JSON.stringify(house)}`);
                //    console.log(`selectedId: ${house.get('selectedId')}`);
				 //   return house.get('selectedId') || !house.get('selectedId');
			    //});

        return window.Server.houses.get(schoolId);  // this is some shit happens around, so I will stay this here for a while
        //return window.Server.houses.get(schoolId, {
        //    filter: {
        //        where: {
        //            schoolId: schoolId,
        //            id: {
        //                nin: []//ids
        //            },
        //            name: {
        //                like: houseName,
        //                options: 'i'
        //            }
        //        }
        //    }
        //});
    },
    /**
     * Сервис фильтрации по школе
     * @param schoolName
     * @returns {*}
     */
    serviceSchoolFilter: function(schoolName) {
        var self = this,
            binding = self.getDefaultBinding(),
            schoolId = binding.get('schoolInfo.id');

        return window.Server.getAllSchools.get({
            filter: {
                where: {
                    id: {
                        neq: schoolId
                    },
                    name: {
                        like: schoolName,
                        options: 'i'
                    }
                },
                limit: 10
            }
        });
    },
    changeCompleteType: function (event) {
        var self = this,
            binding = self.getDefaultBinding(),
            type = event.target.value,
            schoolInfo = binding.get('schoolInfo'),
            rivals = Immutable.List();

        if (type === 'inter-schools') {
            rivals = rivals.push(binding.get('schoolInfo'));
        } else if (type === 'internal') {
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
    //changeCompleteAges: function (event) {
    //    var binding = this.getDefaultBinding(),
    //        agesBinding = binding.sub('model.ages');
    //
    //    agesBinding.update(function (ages) {
    //        if (ages === null) {
    //            ages = Immutable.List();
    //        }
    //
    //        return ages.push(event.target.value);
    //    });
    //},
    changeCompleteAges: function (selections) {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('model.ages', Immutable.fromJS(selections));
    },
	onSelectRival: function (order, id, model) {
		var self = this,
			binding = self.getDefaultBinding(),
            comboBoxes = document.getElementsByClassName('eCombobox_input'), //Get all input comboboxes in the component
            dupErrorEl = ReactDOM.findDOMNode(self.refs.dupError),
            gameType = ReactDOM.findDOMNode(self.refs.gameType).value;
        /*
        * Quick fix for duplicated fields
        * check combo boxes for equality if equal alert the user
        * */
        if(gameType ==='houses'){
            if(model.name !== comboBoxes[order].value){
                document.getElementsByClassName('eEvents_button')[1].style.display = 'inline-block'; //Show the next button again if hidden
                dupErrorEl.style.display = 'none';
                if (model) {
                    binding.update('rivals', function (rivals) {
                        var index = rivals.findIndex(function (rival) {
                            return rival.get('id') === id;
                        });
                        if (index === -1) {
                            return rivals.set(order, Immutable.fromJS(model));
                        } else {
                            return rivals;
                        }
                    });
                }
            }else{
                document.getElementsByClassName('eEvents_button')[1].style.display = 'none'; // Hide next button to avoid temptation of hitting it!
                dupErrorEl.style.display = 'block'; //Show error message
            }
        }else{
            if (model) {
                binding.update('rivals', function (rivals) {
                    var index = rivals.findIndex(function (rival) {
                        return rival.get('id') === id;
                    });
                    if (index === -1) {
                        return rivals.set(order, Immutable.fromJS(model));
                    } else {
                        return rivals;
                    }
                });
            }
        }
	},
    getSports: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            sportsBinding = self.getBinding('sports');

        return sportsBinding.get('models').map(function (sport) {
            return <Morearty.DOM.option
				selected={sport.get('id') === binding.get('model.sportId')}
                value={sport.get('id')}
				key={sport.get('id') + '-sport'}
			>{sport.get('name')}</Morearty.DOM.option>
        }).toArray();
    },
	getDefaultGender: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			sportId = binding.get('model.sportId'),
			sportsBinding = self.getBinding('sports'),
			sport = sportsBinding.get('models').find(function (sport) {
				return sport.get('id') === sportId;
			});

		if (sport) {
			return sport.toJS('limits.genders.0');
		} else {
			return null;
		}
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
            return sport.toJS().limits.genders.map(function (gender, genInd) {
                var names = {
                    male: 'boys',
                    female: 'girls'
                };

                return <label key={genInd} onClick={self.changeCompleteGender}>
                            <Morearty.DOM.input
                                type="radio"
                                key={gender + '-gender'}
                                value={gender}
                                checked={gender === binding.get('model.gender')}
                            />
                            {names[gender]}
                        </label>;
            });
        } else {
            return null;
        }
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
        return new Date(date).toLocaleDateString();
    },
    getEventTime: function(date) {
        return new Date(date).toLocaleTimeString();
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            activeSchoolName = binding.get('schoolInfo.name'),
			sportId = binding.get('model.sportId'),
            services = {
                'inter-schools': self.serviceSchoolFilter,
                'houses': self.serviceHouseFilter,
                'internal': self.serviceClassFilter
            },
            gender = binding.get('model.gender'),
            type = binding.get('model.type');

		return <div className="eManager_base">
            <div className="eManager_group">
                {'Choose Date'}
                <Morearty.DOM.input
                    className="eManager_field"
                    type="text"
                    value={self.getEventDate(binding.get('model.startTime'))}
                    disabled={'disabled'}
                    />
            </div>
            <div className="eManager_group">
                {'Time'}
                <Morearty.DOM.input
                    className="eManager_field"
                    type="text"
                    value={self.getEventTime(binding.get('model.startTime'))}
                    disabled={'disabled'}
                    />
            </div>
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
                    <div className="eManager_select_wrap">
                        <select
                            className="eManager_select"
                            value={sportId}
                            defaultValue={null}
                            onChange={self.changeCompleteSport}>
                            <Morearty.DOM.option
                                key="nullable-type"
                                value={null}
                                selected="selected"
                                disabled="disabled">not selected</Morearty.DOM.option>
                            {self.getSports()}
                        </select>
                        <SVG classes="selectArrow" icon="icon_dropbox_arrow"/>
                    </div>
                </div>
            </If>
            <If condition={!!binding.get('model.sportId')}>
                <div className="eManager_group">
                    {'Gender'}
                    <div className="eManager_radiogroup">
                        {self.getGenders()}
                    </div>
                </div>
            </If>
            <If condition={!!binding.get('model.sportId') && !!binding.get('model.gender')}>
                <div className="eManager_group">
                    {'Ages'}
                    <Multiselect
                        binding={binding}
                        items={binding.get('availableAges').map(function (age) {
                            return {
                                id: age,
                                text: 'Y' + age
                            };
                        }).toJS()}
                        selections={binding.toJS('model.ages')}
                        onChange={self.changeCompleteAges}
                    />
                </div>
            </If>
            <If condition={binding.get('model.ages').count() > 0}>
                <div className="eManager_group">
                    {'Game Type'}
                    <div className="eManager_select_wrap">
                        <select ref="gameType"
                                className="eManager_select"
                                defaultValue={null}
                                value={type}
                                onChange={self.changeCompleteType}>
                            <Morearty.DOM.option key="nullable-type"
                                                 value={null}
                                                 selected="selected"
                                                 disabled="disabled">not selected</Morearty.DOM.option>
                            <Morearty.DOM.option key="inter-schools-type"
                                                 value="inter-schools">inter-schools</Morearty.DOM.option>
                            <Morearty.DOM.option key="houses-type"
                                                 value="houses">houses</Morearty.DOM.option>
                            <Morearty.DOM.option key="anyway-type"
                                                 value="internal">internal</Morearty.DOM.option>
                        </select>
                        <SVG classes="selectArrow" icon="icon_dropbox_arrow"/>
                    </div>
                </div>
            </If>
            <If condition={!!type}>
                <div>
                    <div className="eManager_group">
                        {type === 'inter-schools' ? 'Choose school' : null}
                        <If condition={type === 'inter-schools'} key={'if-choose-school'}>
                            <div>
                                <Autocomplete
                                    serviceFilter={services[type]}
                                    serverField="name"
                                    placeholderText={'enter school name'}
                                    onSelect={self.onSelectRival.bind(null, 1)}
                                    binding={binding.sub('autocomplete.inter-schools.0')}
                                />
                            </div>
                        </If>
                        {type === 'houses' ? 'Choose houses' : null}
                        <If condition={type === 'houses'}>
                            <div className="eChooseHouses">
                                <Autocomplete
                                    serviceFilter={services[type]}
                                    serverField="name"
                                    placeholderText={'The first house'}
                                    onSelect={self.onSelectRival.bind(null, 0)}
                                    binding={binding.sub('autocomplete.houses.0')}
                                />
                                <Autocomplete
                                    serviceFilter={services[type]}
                                    serverField="name"
                                    placeholderText={'The second house'}
                                    onSelect={self.onSelectRival.bind(null, 1)}
                                    binding={binding.sub('autocomplete.houses.1')}
                                />
                                <div ref="dupError" className="hHouseDuplicateError">
                                    <span>The above fields are duplicates-please select unique house names!</span>
                                </div>
                            </div>
                        </If>
                        {type === 'internal' ? 'Create a team' : null}
                        <If condition={type === 'internal'}>
                            <div>
                                <input
                                    key="firstTeam"
                                    type="text"
                                    placeholder="The first team"
                                    value={binding.get('rivals.0.name')}
                                    onChange={Morearty.Callback.set(binding.sub('rivals.0.name'))}
                                    className="eManager_eField" />
                                <input
                                    key="secondTeam"
                                    type="text"
                                    placeholder="The second team"
                                    value={binding.get('rivals.1.name')}
                                    onChange={Morearty.Callback.set(binding.sub('rivals.1.name'))}
                                    className="eManager_eField" />
                            </div>
                        </If>
                    </div>
                    <div className="eManager_group">
                        <EventVenue sportType={type} binding={binding}/>
                    </div>
                </div>
            </If>
        </div>;
	}
});


module.exports = EventManagerBase;
