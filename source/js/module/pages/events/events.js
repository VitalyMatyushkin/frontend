var EventView,
    RouterView = require('module/core/router'),
    Route = require('module/core/route'),
    SubMenu = require('module/ui/sub_menu');

EventView = React.createClass({
	mixins: [Morearty.Mixin],
    getMergeStrategy: function () {
        return Morearty.MergeStrategy.MERGE_REPLACE
    },
    getDefaultState: function () {
        var self = this;

        return Immutable.fromJS({
            eventsRouting: {},
            teams: [],
            sports: {
                models: [],
                sync: false
            },
            models: [],
            sync: false
        });
    },
    componentWillMount: function () {
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
            binding = self.getDefaultBinding(),
            sportsBinding = binding.sub('sports'),
            teamsBinding = binding.sub('teams');

        window.Server.sports.get().then(function (data) {
            sportsBinding.update(function () {
                return Immutable.fromJS({
                    sync: true,
                    models: data
                });
            });
        });

        window.Server.teamsBySchoolId.get(activeSchoolId).then(function (data) {
            var filteredEvents = data.map(function (team) {
                return team.events[0];
            }).reduce(function (memo, val) {
                var filtered = memo.filter(function (mem) {
                    return mem.id === val.id;
                });

                if (filtered.length === 0) {
                    memo.push(val);
                }

                return memo;
            }, []);

            teamsBinding.set(Immutable.fromJS({
                sync: true,
                models: data
            }));

            binding
                .atomically()
                .set('models', Immutable.fromJS(filteredEvents))
                .set('sync', true)
                .commit();
        });

        self.menuItems = [{
            href: '/#events/calendar',
            name: 'Calendar',
            key: 'Calendar'
        },{
            href: '/#events/challenges',
            name: 'Challenges',
            key: 'Challenges'
        },
        {
            href: '/#events/manager',
            name: 'Manager',
            key: 'Manager'
        },
        {
            href: '/#events/invites',
            name: 'Invites',
            key: 'Invites'
        }];
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            rootBinging = self.getMoreartyContext().getBinding();

		return <div>
            <SubMenu binding={binding.sub('eventsRouting')} items={self.menuItems} />
            <div className='bEvents'>
                <RouterView routes={ binding.sub('eventsRouting') } binding={rootBinging}>
                    <Route path='/events/manager' binding={binding} component='module/pages/events/event_manager'  />
                    <Route path='/events/calendar'  binding={binding}component='module/pages/events/events_calendar'   />
                    <Route path='/events/challenges' binding={binding} component='module/pages/events/events_challenges'  />
                    <Route path='/events/invites' binding={binding} component='module/pages/events/events_invites'  />
                </RouterView>
            </div>
        </div>;
	}
});


module.exports = EventView;
