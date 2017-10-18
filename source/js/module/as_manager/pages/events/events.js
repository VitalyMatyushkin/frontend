const   React                       = require('react'),
        Morearty                    = require('morearty'),
        Immutable                   = require('immutable'),

        RouterView                  = require('module/core/router'),
        Route                       = require('module/core/route'),

        SubMenu                     = require('module/ui/menu/sub_menu'),
        EventsCalendarComponent     = require('./calendar/events_calendar'),
        EventManagerComponent       = require('./event_manager'),
        EventFixturesComponent      = require('./events_fixtures'),

        MoreartyHelper              = require('module/helpers/morearty_helper');

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
            fixtures: {}
        });
    },
    componentWillMount: function () {
        const self = this;

        self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

        self._initMenuItems();
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
            }
        ];
    },
    render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinging = self.getMoreartyContext().getBinding();

        return (
            <div>
                <SubMenu    binding = {binding.sub('eventsRouting')}
                            items   = {self.menuItems}
                />
                <div className='bSchoolMaster'>
                    <RouterView routes  = {binding.sub('eventsRouting')}
                                binding = {rootBinging}
                    >
                        <Route path         = '/events/calendar'
                               binding      = {binding.sub('calendar')}
                               component    = {EventsCalendarComponent}
                        />
                        <Route path         = '/events/fixtures'
                               binding      = {
                                                {
                                                    default: binding.sub('fixtures'),
                                                    calendar: binding.sub('calendar')
                                                }
                                            }
                               component    = {EventFixturesComponent}
                        />
                        <Route
                            path            = '/events/manager'
                            activeSchoolId  = {self.activeSchoolId}
                            binding         = {
                                                {
                                                    default:    binding.sub('newEvent'),
                                                    calendar:   binding.sub('calendar')
                                                }
                                            }
                            component       = {EventManagerComponent}
                        />
                    </RouterView>
                </div>
            </div>
        );
    }
});

module.exports = EventView;