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
            participants: [],
            mode: null,
            eventId: null,
            players: [],
            points: []
        });
    },
    componentWillMount: function () {
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            binding = self.getDefaultBinding(),
            eventId = rootBinding.get('routing.pathParameters.0'),
            mode = rootBinding.get('routing.pathParameters.1');

		binding.addListener('players', function (descriptor) {
			var path = descriptor.getPath(),
				previous = descriptor.getPreviousValue(),
				current;

			if (previous && previous.get(path[0])   ) {
				previous = previous.get(path[0]).toJS();
				current = binding.toJS(['players', path[0]]);

				if (current.length > previous.length) {
					window.Server.playersRelation.put({
						teamId: binding.get(['participants', path[0], 'id']),
						studentId: current.pop().id
					});
				} else if (current.length < previous.length) {
					previous.filter(function (player) {
						return !current.some(function (model) {
							return model.id === player.id;
						});
					}).forEach(function(player) {
						window.Server.playersRelation.delete({
							teamId: binding.get(['participants', path[0], 'id']),
							studentId: player.id
						});
					});
				}
			}
		});

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
                include: [
					{
						participants: [
                            'players',
                            {
							    school: 'forms'
						    },
                            'house'
                        ]
					},
					{
						invites: ['guest', 'inviter']
					},
                    {
                        result: 'points'
                    },
					'sport'
                ]
            }
        }).then(function (res) {
			var event = res,
				participants = res.participants,
				invites = res.invites,
				activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
				sport = res.sport,
				schoolInfo = event.participants[0].school.id === activeSchoolId ?
					event.participants[0].school : event.participants[1].school,
                points = event.result ? event.result.points : [];

			delete event.participants;
			delete event.invites;
			delete event.sport;

			binding
				.atomically()
				.set('sport', Immutable.fromJS(sport))
				.set('model', Immutable.fromJS(event))
				.set('invites', Immutable.fromJS(invites))
				.set('participants', Immutable.fromJS(participants))
                .set('points', Immutable.fromJS(points))
				.set('players', Immutable.fromJS([
					participants[0].players,
					participants[1] ? participants[1].players : []
				]))
				.set('schoolInfo', Immutable.fromJS(schoolInfo))
				.set('eventId', eventId)
                .set('mode', mode)
				.commit();
        });

        rootBinding.addListener('routing.pathParameters', function () {
            binding.set('mode', rootBinding.get('routing.pathParameters.1') || null)
        });
    },
	render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();

		return <div>
            <SubMenu binding={binding.sub('eventRouting')} items={self.menuItems} />
            <div className="bEventContainer">
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
