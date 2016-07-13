const   RouterView      = require('module/core/router'),
        Route           = require('module/core/route'),
        React           = require('react'),
        SubMenu         = require('module/ui/menu/sub_menu'),
        MoreartyHelper  = require('module/helpers/morearty_helper'),
        EventHelper     = require('module/helpers/eventHelper'),
        Lazy            = require('lazy.js'),
        DateHelper      = require('module/helpers/date_helper'),
        Morearty		= require('morearty'),
        Immutable       = require('immutable');

const EventView = React.createClass({
	mixins: [Morearty.Mixin],
    // ID of current school
    // Will set on componentWillMount event
    activeSchoolId: undefined,
    getMergeStrategy: function () {
        return Morearty.MergeStrategy.MERGE_REPLACE
    },
    getDefaultState: function () {

        return Immutable.fromJS({
            eventsRouting: {},
            teams: [],
            sports: {
                models: [],
                sync: false
            },
            models: [],
            sync: false,
            newEvent: {}
        });
    },
    componentWillMount: function () {
        const self = this;

        self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

        self._initMenuItems();

        // set data
        self._setEvents();
        self._setSports();

        // add listeners
        self._addListeners();
    },
    _addListeners: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        // Listen changes of date in calendar
        binding.addListener('calendar.currentMonth', () => {
            const currentDate = binding.toJS('calendar.currentDate');

            self._setEventsByDateRange(
                DateHelper.getStartDateTimeOfMonth(currentDate),
                DateHelper.getEndDateTimeOfMonth(currentDate)
            );
        });
    },
    _setEvents: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        const currentDate = binding.toJS('calendar.currentDate');

        self._setEventsByDateRange(
            DateHelper.getStartDateTimeOfMonth(currentDate),
            DateHelper.getEndDateTimeOfMonth(currentDate)
        );
    },
    _ifMonthHasBeenChanged: function(currentDate, prevDate) {
        return  !prevDate ||
                DateHelper.getMonthNumber(currentDate) !== DateHelper.getMonthNumber(prevDate);
    },
    _setSports: function() {
        const   self    = this,
                binding = self.getDefaultBinding();

        window.Server.sports.get({
            filter: {
                limit: 100
            }
        })
        .then(
            sports => binding.atomically()
                .set('sports.sync', true)
                .set('sports.models', Immutable.fromJS(sports))
                .commit()
        );
    },
    _setEventsByDateRange: function(gteDate, ltDate) {
        const   self            = this,
                binding         = self.getDefaultBinding();

        window.Server.events.get(self.activeSchoolId, {
            filter: {
                limit: 100,
                where: {
                    startTime: {
                        '$gte': gteDate,// like this `2016-07-01T00:00:00.000Z`,
                        '$lt':  ltDate// like this `2016-07-31T00:00:00.000Z`
                    }
                }
            }
        })
        .then(events => events.filter(event => EventHelper.isShowEventOnCalendar(event, self.activeSchoolId)))
        .then(events => {
            binding
                .atomically()
                .set('models', Immutable.fromJS(events))
                .set('sync', true)
                .commit();
        });
    },
    _getEventTeams: function(event) {
        const self = this;

        // Get event teams
        return Promise.all(
            event.teams.map(teamId => {
                return window.Server.team.get(
                    {
                        schoolId:   self.activeSchoolId,
                        teamId:     teamId
                    }
                    )
                    .then(team => {
                        if(team.houseId) {
                            return window.Server.schoolHouse.get(
                                {
                                    schoolId:   self.activeSchoolId,
                                    houseId:    team.houseId
                                }
                            ).then(house => {
                                team.house = house;
                                return Promise.resolve(team);
                            });
                        } else {
                            return Promise.resolve(team);
                        }
                    });
            })
        )
        // Set teams to event
        .then(teams => event.participants = teams);
    },
    /**
     * Methods inject sport model to each event by sportId from event.
     * !!! Method modify events array.
     * @param events
     * @param sports
     * @private
     */
    _injectSportToEvents: function(events, sports) {
        events.map(event => event.sport = Lazy(sports).findWhere({id: event.sportId}));
    },
    _initMenuItems: function() {
        const self = this;

        self.menuItems = [
            {
                href: '/#events/calendar',
                name: 'Calendar',
                key: 'Calendar'
            },{
                href: '/#events/fixtures',
                name: 'Fixtures',
                key: 'Fixtures'
            },{
                href: '/#events/manager',
                name: 'New',
                key: 'New...'
            }
        ];
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            rootBinging = self.getMoreartyContext().getBinding();

		return (
            <div>
                <SubMenu binding={binding.sub('eventsRouting')} items={self.menuItems}/>
                <div className='bSchoolMaster'>
                    <div className='bEvents'>
                        <RouterView routes={ binding.sub('eventsRouting') } binding={rootBinging}>
                            <Route path='/events/calendar'
                                   binding={binding}
                                   component='module/as_manager/pages/events/events_calendar'
                            />
                            <Route
                                path='/events/manager'
                                binding={
                                    {
                                        default: binding.sub('newEvent'),
                                        sports: binding.sub('sports'),
                                        calendar: binding.sub('calendar')
                                    }
                                }
                                component='module/as_manager/pages/events/event_manager'
                            />
                            <Route path='/events/fixtures'
                                   binding={binding}
                                   component='module/ui/fixtures/events_fixtures'
                            />
                            <Route path='/events/invites'
                                   binding={binding}
                                   component='module/as_manager/pages/events/events_invites'
                            />
                        </RouterView>
                    </div>
                </div>
            </div>
        );
	}
});


module.exports = EventView;
