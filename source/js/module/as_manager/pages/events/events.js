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

        window.Server.sports.get().then(function (sports) {
            sportsBinding
                .atomically()
                .set('sync', true)
                .set('models', Immutable.fromJS(sports))
                .commit();

            return window.Server.eventsBySchoolId.get({
                schoolId: activeSchoolId
            }, {
                filter: {
                    include: 'sport'
                }
            });
        }).then(function (events) {
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
                href: '/#events/challenges',
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
                    <div className="eSchoolMaster_wrap">
                        <h1 className="eSchoolMaster_title"></h1>
                        <div className="eStrip">
                        </div>
                    </div>
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
                            <Route path='/events/challenges'
                                   binding={binding}
                                   component='module/as_manager/pages/events/events_challenges'
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
