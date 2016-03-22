const   classNames           = require('classnames'),
        If                   = require('module/ui/if/if'),
        EventHeader          = require('./view/event_header'),
        EventRivals          = require('./view/event_rivals'),
        EventButtons         = require('./view/event_buttons'),
        EventTeams           = require('./view/event_teams'),
        EventAlbums          = require('./view/event_albums'),
        React                = require('react'),
        Comments             = require('./view/event_blog'),
        VenuePreview         = require('../events/manager/venue_preview'),
        Immutable            = require('immutable'),
        Lazy                 = require('lazyjs');

const EventView = React.createClass({
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
            mode: 'general',
            showingComment: false
        });
    },
    componentWillMount: function () {
        var self = this,
            rootBinding  = self.getMoreartyContext().getBinding(),
            binding      = self.getDefaultBinding(),
            eventId      = rootBinding.get('routing.pathParameters.0');

        binding.addListener('players', function (descriptor) {
			var path = descriptor.getPath(),
				previous = descriptor.getPreviousValue(),
				current;

            if (previous && previous.get(path[0])) {
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
                } else {
                    let changedPlayer;
                    for(let prevIndex in previous) {
                        let findCurrPlayer = Lazy(current).findWhere({id:previous[prevIndex].id});
                        if(
                            findCurrPlayer.position !== previous[prevIndex].position ||
                            findCurrPlayer.sub !== previous[prevIndex].sub
                        ) {
                            changedPlayer = findCurrPlayer;
                            break;
                        }
                    }
                    window.Server.exactlyPlayersByTeam.put(
                        {
                            teamId:    binding.get(['participants', path[0], 'id']),
                            playerId:  changedPlayer.exactlyPlayerId
                        },
                        {
                            position:  changedPlayer.position,
                            sub:       changedPlayer.sub
                        }
                    )
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

        window.Server.eventFindOne.get({
            filter: {
                where: {
                    id: eventId
                },
                include: [
					{
						participants: [
							{
                                players: ['user', 'form']
							},
							{
							    school: 'forms'
							},
                            {
                                exactlyPlayers: 'student'
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

            self._injectDataToStudentModel(participants[0]);
            participants[1] && self._injectDataToStudentModel(participants[1]);

			binding
				.atomically()
				.set('sport', Immutable.fromJS(sport))
				.set('model', Immutable.fromJS(event))
                .set('model.sportModel', Immutable.fromJS(sport))
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
    // copy id position field and sub field from player model to student model
    _injectDataToStudentModel: function(participants) {
        for(let studentIndex in participants.players) {
            for(let playerIndex in participants.exactlyPlayers) {
                if(participants.exactlyPlayers[playerIndex].student.userId === participants.players[studentIndex].userId) {
                    participants.players[studentIndex].exactlyPlayerId = participants.exactlyPlayers[playerIndex].id;
                    participants.players[studentIndex].position = participants.exactlyPlayers[playerIndex].position;
                    if(participants.exactlyPlayers[playerIndex].sub) {
                        participants.players[studentIndex].sub = participants.exactlyPlayers[playerIndex].sub;
                    }
                }
            }
        }
    },
    onToggleShowComment: function() {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('showingComment', !binding.get('showingComment'));
    },
    //A function that shadows comment keystrokes in order to show the comments right after the manager has entered them
    //This avoids the manager having to reload the screen to see what they just entered.
    onChange:function(){
        var self = this,
            comment = document.getElementById('commentTextArea');
        if(comment){
            self.commentContent = comment.value;
        }else{
            self.commentContent = '0';
        }
    },
	render: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            showingComment = binding.get('showingComment'),
            commentTextClasses = classNames({
                'eEvent_commentText': true,
                mHide: !showingComment
            });  self.onChange();
		return <div>
            <div className="bEventContainer">
                <If condition={binding.get('sync')=== true}>
                    <div className="bEvent">
                        <div className="eEvent_commentBox">
                            <If condition={(binding.get('mode') === 'closing') || false}>
                                <Morearty.DOM.textarea
                                    placeholder="comments"
                                    className="eEvent_comment"
                                    onChange={Morearty.Callback.set(binding, 'model.comment')}
                                    value={binding.get('model.comment')} id="commentTextArea"
                                    />
                            </If>
                            <If condition={(binding.get('mode') === 'general' && binding.get('model.result.comment')!==undefined) || false}>
                                <div>
                                    <div className="eEvent_commentHeader" onClick={self.onToggleShowComment}>{binding.get('showingComment') ? 'hide' : 'show comment'}</div>
                                    <div className={commentTextClasses}>{binding.get('model.result.comment')}</div>
                                </div>
                            </If>
                        </div>
                        <EventButtons binding={binding} />

                        <div className="bEventHeader_wrap">
                            <EventHeader binding={binding}/>
                            <EventRivals binding={binding}/>
                        </div>
                        <EventTeams binding={binding} />
                        <If condition={(binding.get('mode') === 'general') && (self.commentContent !=='0') || false}>
                            <div className="eEvent_shadowCommentText">{self.commentContent}</div>
                        </If>
                        <EventAlbums binding={binding} />
                        <If condition={((binding.get('mode') === 'general') && (binding.get('model.resultId') !== undefined)) || false}>
                            <Comments binding={binding}/>
                        </If>
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
