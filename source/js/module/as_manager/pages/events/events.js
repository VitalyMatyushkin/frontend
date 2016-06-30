const   RouterView      = require('module/core/router'),
        Route           = require('module/core/route'),
        React           = require('react'),
        SubMenu         = require('module/ui/menu/sub_menu'),
        MoreartyHelper  = require('module/helpers/morearty_helper'),
        EventHelper     = require('module/helpers/eventHelper'),
        Lazy            = require('lazyjs'),
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
        const self = this,
            binding = self.getDefaultBinding(),
            sportsBinding = binding.sub('sports');

        self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

        self._initMenuItems();

        let events, sports;

        window.Server.sports.get({
                filter: {
                    limit: 100
                }
            })
            .then(_sports => {
                sports = _sports;

                sportsBinding
                    .atomically()
                    .set('sync', true)
                    .set('models', Immutable.fromJS(sports))
                    .commit();

                // TODO don't forget about include
                //{
                //    filter: {
                //        include: 'sport'
                //    }
                //}
                return window.Server.events.get(self.activeSchoolId, {
                    filter: {
                        limit: 100
                    }
                });
            })
            .then(events => {
                return events.filter(event => {
                    // don't show inter-schools events if invited school not yet accept invitation and
                    // if invited school is an active school.
                    return !(
                        event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools'] &&
                        event.invitedSchoolId === self.activeSchoolId &&
                        event.teams.length === 1 // if team count === 1 then opponent school not yet accept invitation
                    );
                });
            })
            .then(_events => {
                events = _events;

                // inject sport to events
                // method modify events array
                self._injectSportToEvents(events, sports);

                // inject team models to event
                return Promise.all(
                    events.map(event => {
                        // if event has inter-school type, then we should inject school model to each team from other school
                        if(event.eventType === EventHelper.clientEventTypeToServerClientTypeMapping['inter-schools']) {
                            return window.Server.publicSchool.get(event.inviterSchoolId !== self.activeSchoolId ? event.inviterSchoolId : event.invitedSchoolId)
                                .then(school => {
                                    return self._getEventTeams(event).then(teams => {
                                        return teams.map(team => {
                                            if(team.schoolId === school.id) {
                                                team.school = school;
                                            }

                                            return team;
                                        });
                                    });
                                })
                        } else {
                            return self._getEventTeams(event);
                        }
                    })
                );
            })
            .then( _ => {
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
