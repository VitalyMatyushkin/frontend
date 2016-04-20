const   RouterView  = require('module/core/router'),
        Route       = require('module/core/route'),
        React       = require('react'),
        SubMenu     = require('module/ui/menu/sub_menu'),
        Immutable   = require('immutable');

const EventView = React.createClass({
	mixins: [Morearty.Mixin],
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
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
            binding = self.getDefaultBinding(),
            sportsBinding = binding.sub('sports');

        self._initMenuItems();

        let events;

        window.Server.sports.get({
                filter: {
                    limit: 100
                }
            })
            .then( sports => {
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
                return window.Server.events.get(activeSchoolId, {
                    filter: {
                        limit: 100
                    }
                });
            })
            .then( _events => {
                events = _events;

                // inject team models to event
                return Promise.all(
                    events.map(event => {
                        // Get event teams
                        return Promise.all(event.teams.map(
                            teamId => window.Server.team.get(
                                {
                                    schoolId: activeSchoolId,
                                    teamId: teamId
                                }
                            ))
                        )
                        // Set teams to event
                        .then(teams => event.participants = teams);
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
