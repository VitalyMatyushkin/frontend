var EventView,
    SVG = require('module/ui/svg');

EventView = React.createClass({
	mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
			routerParameters = rootBinding.toJS('routing.parameters');

        console.log(routerParameters);

		window.Server.eventFindOne.get({
            filter: {
                include: [
                    {
                        participants: 'players'
                    },
                    'result',
                    'invites'
                ],
                where: {id: routerParameters.id}
            }
            //'filter[include][participants]=players&filter[where][id]=' + routerParameters.id
		}).then(function (res) {
            var participants = res.participants;
            binding.set('eventInfo', Immutable.fromJS(res));
            binding
                .sub('eventInfo')
                .meta()
                .set('rivals', Immutable.List())
                .set('mode', 'normal');

            if (participants.length === 1 ) {
                participants.push({
                    schoolId: res.invites[0].invitedId
                });
            }

            res.participants.forEach(function (rival, index) {
                var serviceUrl = window.Server.school,
                    id = rival.schoolId;

                if (rival.rivalType === 'house') {
                    serviceUrl = window.Server.house;
                    id = rival.houseId;
                } else if (rival.rivalType === 'class') {
                    serviceUrl = window.Server.class;
                    id = rival.classId;
                }

                serviceUrl.get(id).then(function (res) {
                    binding.set('eventInfo.rivals.' + index, Immutable.fromJS(res));
                });
            });
		});
    },
    getDateTime: function (str) {
        var now     = new Date(str);
        var year    = now.getFullYear();
        var month   = now.getMonth()+1;
        var day     = now.getDate();
        var hour    = now.getHours();
        var minute  = now.getMinutes();
        var second  = now.getSeconds();

        if(month.toString().length == 1) {
            month = '0'+month;
        }
        if(day.toString().length == 1) {
            day = '0'+day;
        }
        if(hour.toString().length == 1) {
            hour = '0'+hour;
        }
        if(minute.toString().length == 1) {
            minute = '0'+minute;
        }
        if(second.toString().length == 1) {
            second = '0'+second;
        }

        return year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;
    },
	getRival: function (order) {
		var self = this,
			binding = self.getDefaultBinding(),
			rival = binding.sub('eventInfo.rivals.' + order);

		return <div className="eEvent_rival">
            <img className="eEvent_rivalPic" src={rival.get('pic')} title={rival.get('name')} alt={rival.get('name')} />
            <span className="eEvent_rivalTitle">{rival.get('name') || 'Unknown'}</span>
        </div>;
	},
    removePlayer: function (playerId, order) {
        var self = this,
            binding = self.getDefaultBinding(),
            participant = binding.sub('eventInfo.participants.' + order);

        window.Server.playersRelation.delete({
            teamId: participant.get('id'),
            studentId: playerId
        }).then(function () {
            participant.update('players', function (players) {
                return players.filter(function (player) {
                    return player.get('id') !== playerId;
                });
            });
        });
    },
    addPoint: function (player) {
        player.update('scores', function (scores) {
            scores = scores || Immutable.List();

            return scores.push(Immutable.fromJS({studentId: player.get('id')}));
        });
    },
    removePoint: function (player) {
        player.update('scores', function (scores) {
            scores = !scores ? Immutable.List() : scores;

            if (scores.count() !== 0 ) {
                scores = scores.pop();
            }

            return scores;
        });
    },
    getPlayers: function (order) {
        var self = this,
            binding = self.getDefaultBinding(),
            participant = binding.sub('eventInfo.participants.' + order),
            players = participant.sub('players'),
			edit = binding.get('eventInfo.mode') === 'edit',
            closeMode = binding.get('eventInfo.mode') === 'close',
			playersClasses = classNames({
				bPlayer: true,
                mShowRemoveButton: edit
			}),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
            owner = activeSchoolId === participant.get('schoolId');

        if (players.get()) {
            return players.get().map(function (player, index) {
                var playerBinding = players.sub(index),
                    score = playerBinding.get('scores') ? playerBinding.get('scores').count() : 0;

                return <span className={playersClasses}>
                    {closeMode ? <span
                       className="ePlayer_addPoint"
                       onClick={self.removePoint.bind(null, playerBinding)}>
                       <SVG icon="icon_plus" />
                    </span> : null}
                    {closeMode ?
                        <span
                            className="ePlayer_score">{score}</span>
                        : null}
                    <img className="ePlayer_avatar" src={player.get('avatar')} />
                    <span className="ePlayer_name">{player.get('firstName')}</span>
                    <span className="ePlayer_lastName">{player.get('lastName')}</span>
                    {owner && edit ? <span
                        className="ePlayer_remove"
                        onClick={self.removePlayer.bind(null, player.get('id'), order)}>
                        <SVG icon="icon_trash" />
                    </span> : null}
                    {closeMode ? <span
                        className="ePlayer_addPoint"
                        onClick={self.addPoint.bind(null, playerBinding)}>
                        <SVG icon="icon_plus" />
                    </span> : null}
                </span>;
            }).toArray();
        } else {
            return null;
        }
    },
	onClickEdit: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			mode = binding.get('eventInfo.mode') === 'edit' ? 'normal' : 'edit';

		binding.set('eventInfo.mode', mode);
	},
    onClickClose: function () {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('eventInfo.mode', 'close');
    },
    onClickCancel: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            participants = binding.sub('eventInfo.participants');

        participants.get().forEach(function (participant, index) {
            participants.sub([index, 'players']).update(function (players) {
                return players.map(function (player) {
                    return player.set('score', 0);
                });
            });
        });

        binding.set('eventInfo.mode', 'normal');
    },
    onClickFinish: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            participants = binding.sub('eventInfo.participants'),
            rivals = binding.sub('eventInfo.rivals');

        window.Server.results.post({eventId: binding.get('eventInfo.id')}).then(function (result) {

            participants.get().forEach(function (participant, index) {
                var participantBinding = participants.sub(index);

                participantBinding.get('players').forEach(function (player, index) {
                    player.get('scores') ? player.get('scores').forEach(function (score, scoreIndex) {
                        window.Server.pointsInResult.post(result.id, {
                            sportId: binding.get('eventInfo.sportId'),
                            studentId: player.get('id'),
                            participantId: participantBinding.get('id'),
                            eventId: binding.get('eventInfo.id'),
                            resultId: result.id,
                            score: 1
                        }).then(function (res) {
                            participantBinding.set(['players', index, 'scores', scoreIndex], Immutable.fromJS(res));
                        });
                    }) : null;
                });
            });

            binding.set('eventInfo.resultId', result.id);
            binding.set('eventInfo.type', binding.get('eventInfo.rivalsType') === 'scools' ? 'external' : 'internal');

            window.Server.event.get({
                eventId: binding.get('eventInfo.id')
            }).then(function (res) {
                res.resultId = result.id;

                window.Server.event.put({
                    eventId: binding.get('eventInfo.id')
                }, res).then(function (res) {
                    binding
                        .atomically()
                        .set('eventInfo.mode', 'normal')
                        .set('eventInfo.result', Immutable.fromJS(result))
                        .set('eventInfo.resultId', result.id)
                        .commit();
                });
            })
        });
    },
    getScore: function (order) {
        var self = this,
            binding = self.getDefaultBinding(),
            resultBinding = binding.sub('eventInfo.result'),
            closed = binding.get('eventInfo.resultId'),
            participant = binding.sub('eventInfo.participants.' + order);

        if (resultBinding.get()) {
            return <span>{resultBinding.get(['summary', 'byTeams', participant.get('id')]) || '0'}</span>;
        } else {
            return <span>-</span>;
        }
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            eventInfo = binding.sub('eventInfo'),
            closed = eventInfo.get('resultId'),
            edit = eventInfo.get('mode') === 'edit',
            closeMode = eventInfo.get('mode') === 'close',
			eventClass = classNames({
				bEvent: true,
				mEdit: edit
			}),
            date = eventInfo.get('startTime') ? self.getDateTime(eventInfo.get('startTime')) : '';

		return <div>
            <div className="bEvents">
                <div className={eventClass}>
                    <h2 className="eEvent_title">{eventInfo.get('name')}
                    {!closed && !closeMode ?
                        <span className="eEvent_edit" onClick={self.onClickEdit}>{!edit ? 'edit' : 'cancel'}</span> : null}
                    {closed ? <span className="eEvent_closed">match closed</span> : null}
                    </h2>
                    <h3 className="eEvent_date">Start: {date}</h3>
                    <div className="eEvent_rivals">
                        {self.getRival(0)}
                        <div className="eEvent_info">
                            <span className="eEvent_infoItem mScore">
                                {closed ? <div>{self.getScore(0)} - {self.getScore(1)}</div> : null}
                                {!closed && !edit && !closeMode ?
                                    <div className="bButton" onClick={self.onClickClose}>close</div>
                                    : null}
                            </span>
                            <span className="eEvent_infoItem mScore">
                                {!closed && closeMode ?
                                    <div className="bButton" onClick={self.onClickFinish}>finish</div>
                                    : null}
                            </span>
                            <span className="eEvent_infoItem mScore">
                                {!closed && closeMode ?
                                    <div className="bButton" onClick={self.onClickCancel}>cancel</div>
                                    : null}
                            </span>
                            <span className="eEvent_infoItem">
                                Type: <strong>{eventInfo.get('type')}</strong>
                            </span>
                            <span className="eEvent_infoItem">
                                Rivals: <strong>{eventInfo.get('rivalsType')}</strong>
                            </span>
                        </div>
                        {self.getRival(1)}
                    </div>
                    <div className="eEvent_teams">
                        <div className="eEvent_team">
                            {self.getPlayers(0)}
                        </div>
                        <div className="eEvent_team">
                            {self.getPlayers(1)}
                        </div>
                    </div>
                </div>
		    </div>
        </div>;
	}
});


module.exports = EventView;
