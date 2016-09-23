const   RouterView      			= require('module/core/router'),
        Route           			= require('module/core/route'),
        React           			= require('react'),
        SubMenu         			= require('module/ui/menu/sub_menu'),
        MoreartyHelper  			= require('module/helpers/morearty_helper'),
        EventHelper     			= require('module/helpers/eventHelper'),
        DateHelper      			= require('module/helpers/date_helper'),
        Morearty					= require('morearty'),
        Immutable       			= require('immutable'),
        EventsCalendarComponent 	= require('module/as_manager/pages/events/events_calendar'),
		EventManagerComponent 		= require('module/as_manager/pages/events/event_manager'),
		EventFixturesComponent 		= require('module/ui/fixtures/events_fixtures');

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
			calendar:{},
            teams: [],
            sports: {
                models: [],
                sync: false
            },
            models: [],
            sync: false,
            newEvent: {},
			fixtures:{}
        });
    },
    componentWillMount: function () {
        const self = this;

        self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

        self._initMenuItems();

        // set data
        self._setSports();
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
                                   component={EventsCalendarComponent}
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
                                component={EventManagerComponent}
                            />
                            <Route path='/events/fixtures'
                                   binding={
										{
											default: binding.sub('fixtures'),
											calendar: binding.sub('calendar')
										}
                                    }
                                   component={EventFixturesComponent}
                            />
                        </RouterView>
                    </div>
                </div>
            </div>
        );
	}
});


module.exports = EventView;
