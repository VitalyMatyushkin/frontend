var EventView,
    RouterView = require('module/core/router'),
    Route = require('module/core/route'),
    SubMenu = require('module/ui/menu/sub_menu');

EventView = React.createClass({
	mixins: [Morearty.Mixin],
    getMergeStrategy: function () {
        return Morearty.MergeStrategy.MERGE_REPLACE;
    },
    getDefaultState: function () {
        return Immutable.fromJS({
            model: {},
            players: [],
            rivals: [],
            mode: null,
            eventId: null
        });
    },
    componentWillMount: function () {
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            binding = self.getDefaultBinding(),
            eventId = rootBinding.get('routing.pathParameters.0'),
            mode = rootBinding.get('routing.pathParameters.1');

        self.menuItems = [{
            href: '/#event/' + eventId,
            name: 'General',
            key: 'General'
        },{
            href: '/#event/' + eventId + '/edit',
            name: 'Edit',
            key: 'Edit'
        },
        {
            href: '/#event/' + eventId + '/finish',
            name: 'Finish',
            key: 'Finish'
        }];

        Server.eventFindOne.get({
            filter: {
                where: {
                    id: eventId
                },
                include: {
                    participants: ['players', 'school', 'house']
                }
            }
        }).then(function (res) {
            console.log(res);
        });
    },
	render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();

		return <div>
            <SubMenu binding={binding.sub('eventRouting')} items={self.menuItems} />
            <div className="bEvent">
                <RouterView routes={ binding.sub('eventRouting') } binding={rootBinding}>
                    <Route path='/event/:id' binding={binding} component='module/as_manager/pages/event/general'   />
                    <Route path='/event/:id/general' binding={binding} component='module/as_manager/pages/event/general'   />
                    <Route path='/event/:id/edit' binding={binding} component='module/as_manager/pages/event/edit'   />
                    <Route path='/event/:id/finish' binding={binding} component='module/as_manager/pages/event/finish'   />
                </RouterView>
            </div>
        </div>;
	}
});


module.exports = EventView;
