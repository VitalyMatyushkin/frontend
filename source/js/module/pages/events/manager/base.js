var Autocomplete = require('module/ui/autocomplete/autocomplete'),
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

        return window.Server.classesFilter.get({
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
        var binding = this.getDefaultBinding();

        binding.set('autocomplete.selectedId', null);
        binding.set('newEvent.model.rivalsType', event.target.value);
    },
	changeCompleteSport: function (event) {
		var binding = this.getDefaultBinding();

		binding.set('newEvent.model.sportId', event.target.value);
	},
	onSelectRival: function (id, response, model) {
		var self = this,
			binding = self.getDefaultBinding();

		if (model) {
			model.players = [];

			binding.update('newEvent.rivals', function (rivals) {
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
	getDefaultSportsId: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			football = binding.get('sports.models').find(function (sport) {
				return sport.get('name') === 'football';
			});

		return football ? football.get('id') : null;
	},
    getSports: function () {
        var self = this,
            sportsBinding = self.getDefaultBinding().sub('sports');

        return sportsBinding.get('models').map(function (sport) {
            return <Morearty.DOM.option
				selected={sport.get('name') === 'football'}
                value={sport.get('id')}
				key={sport.get('id') + '-sport'}
			>{sport.get('name')}</Morearty.DOM.option>
        }).toArray();
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
            rivalsType = binding.get('newEvent.model.rivalsType'),
			sportId = binding.get('newEvent.model.sportId'),
            services = {
                schools: self.serviceSchoolFilter.bind(self, activeSchoolId),
                houses: self.serviceHouseFilter.bind(self, activeSchoolId),
                classes: self.serviceClassFilter.bind(self, activeSchoolId)
            };

		return <div className="eManager_base">
            <div className="eManager_group">
                    {'What\'s Event title?'}
                <Morearty.DOM.input
                    className="eManager_field"
                    type="text"
                    value={binding.get('newEvent.name')}
                    placeholder={'enter name'}
                    onChange={Morearty.Callback.set(binding.sub('newEvent.name'))}
                />
            </div>
            <div className="eManager_group">
                    {'What\'s Event description?'}
                <Morearty.DOM.textarea
                    className="eManager_field mTextArea"
                    type="text"
                    value={binding.get('newEvent.description')}
                    placeholder={'enter description'}
                    onChange={Morearty.Callback.set(binding.sub('newEvent.description'))}
                />
            </div>
            <div className="eManager_group">
                    {'What\'s the game?'}
                <select
                    className="eManager_select"
					value={sportId}
					defaultValue={self.getDefaultSportsId()}
                    onChange={self.changeCompleteSport}>
                    {self.getSports()}
                </select>
            </div>
            <div className="eManager_group">
                Rivals will be
                <select
                    className="eManager_select"
					defaultValue="schools"
                    value={rivalsType}
                    onChange={self.changeCompleteType}>
                    <Morearty.DOM.option key="schools-type" value="schools">schools</Morearty.DOM.option>
                    <Morearty.DOM.option key="houses-type" value="houses">houses</Morearty.DOM.option>
                    <Morearty.DOM.option key="classes-type" value="classes">classes</Morearty.DOM.option>
                </select>
            </div>
            <div className="eManager_group">
                {rivalsType === 'houses' || rivalsType === 'classes' ? 'Who are Rivals?' : 'Who is your Rival?'}
                <Autocomplete
                    serviceFilter={services[rivalsType]}
                    serverField="name"
					placeholder={'enter rival name'}
					onSelect={self.onSelectRival}
                    binding={binding.sub(['autocomplete', rivalsType, 0])}
                />
                {rivalsType === 'houses' || rivalsType === 'classes' ?
                    <Autocomplete
                        serviceFilter={services[rivalsType]}
                        serverField="name"
                        onSelect={self.onSelectRival}
                        binding={binding.sub(['autocomplete', rivalsType, 1])}
                    /> : null
                }
            </div>
        </div>;
	}
});


module.exports = EventManagerBase;
