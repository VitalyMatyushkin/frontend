var EventView,
    RouterView = require('module/core/router'),
    Route = require('module/core/route'),
    If = require('module/ui/if/if'),
    EventHeader = require('./view/event_header'),
    EventRivals = require('./view/event_rivals'),
    EventButtons = require('./view/event_buttons'),
    EventTeams = require('./view/event_teams'),
    EventAlbums = require('./view/event_albums');

EventView = React.createClass({
	mixins: [Morearty.Mixin],
    displayName: 'EventPage',
    getMergeStrategy: function () {
        return Morearty.MergeStrategy.MERGE_REPLACE;
    },
    getDefaultState: function () {
        return Immutable.fromJS({
            model: {},
            participants: [],
            eventId: null,
            players: [],
            points: [],
            result: {
                points: []
            },
            sync: false,
            mode: 'general'
        });
    },
    componentWillMount: function () {
        var self = this,
            rootBinding = self.getMoreartyContext().getBinding(),
            binding = self.getDefaultBinding(),
            eventId = rootBinding.get('routing.pathParameters.0');

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
                    {
                        sport: ''
                    },
                    {
                        albums: 'photos'
                    }
                ]
            }
        }).then(function (res) {
			var event = res,
				participants = res.participants,
				invites = res.invites,
				activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
				sport = res.sport,
                albums = res.albums,
				schoolInfo = event.participants[0].school.id === activeSchoolId ?
					event.participants[0].school : event.participants[1].school,
                points = event.result && event.result.points ? event.result.points : [];

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
                .set('albums', Immutable.fromJS(albums))
				.set('players', Immutable.fromJS([
					participants[0].players,
					participants[1] ? participants[1].players : []
				]))
				.set('schoolInfo', Immutable.fromJS(schoolInfo))
				.set('eventId', eventId)
                .set('mode', 'general')
                .set('sync', true)
				.commit();

        });

        rootBinding.addListener('routing.pathParameters', function () {
            binding.set('mode', rootBinding.get('routing.pathParameters.1') || null)
        });
    },
	render: function() {
        var self = this,
            binding = self.getDefaultBinding();

		return <div>
            <div className="bEventContainer">
                <If condition={binding.get('sync')}>
                    <div className="bEvent">
                        <EventButtons binding={binding} />
                        <EventHeader binding={binding} />
                        <div className="eEvent_commentBox">
                            <If condition={binding.get('mode') === 'closing'}>
                                <Morearty.DOM.textarea
                                    className="eEvent_comment"
                                    onChange={Morearty.Callback.set(binding, 'model.comment')}
                                    value={binding.get('model.comment')}
                                    />
                            </If>
                            <If condition={binding.get('mode') === 'general' && binding.get('model.comment')}>
                                <span className="eEvent_commentText">{binding.get('model.comment')}</span>
                            </If>
                        </div>
                        <EventRivals binding={binding} />
                        <EventAlbums binding={binding} />
                        <EventTeams binding={binding} />
                    </div>
                </If>
                <If condition={!binding.get('sync')}>
                    <span>loading...</span>
                </If>
            </div>
        </div>;
	}
});


module.exports = EventView;
