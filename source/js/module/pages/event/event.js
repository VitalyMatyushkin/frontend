var EventView,
	AutocompleteTeam = require('module/ui/managers/autocompleteTeam'),
    SVG = require('module/ui/svg');

EventView = React.createClass({
	mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
			routerParameters = rootBinding.toJS('routing.parameters');

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
		}).then(function (res) {
            var participants = res.participants;

            if (participants.length === 1) {
                participants.push({
                    schoolId: res.invites[0].invitedId,
					players: []
                });
            }

			binding
				.set('model', Immutable.fromJS(res))
				.set('rivals', Immutable.List());

			binding
				.sub('model')
				.meta()
				.set('mode', 'normal');

			binding.addListener('model.participants', function (descriptor) {
				var path = descriptor.getPath(),
					previos = descriptor.getPreviousValue() ? descriptor.getPreviousValue().toJS() : null,
					current;

				if (path[1] === 'players' && previos) {
					current = binding.toJS(['model', 'participants'].concat(path));

					if (current.length > previos.length) {
						window.Server.playersRelation.put({
							teamId: binding.get(['model', 'participants', path[0], 'id']),
							studentId: current.pop().id
						}).then(function (res) {
							console.log(res);
						});
					}
				}
			});

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
					res.players = participants[index].players || [];
                    binding.set('rivals.' + index, Immutable.fromJS(res));
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
			rival = binding.sub('rivals.' + order),
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('userRules.activeSchoolId'),
			edit = binding.get('model.mode') === 'edit',
			owner = activeSchoolId === rival.get('id'),
			completeBinding = {
				rival: binding.sub('model.participants.' + order),
				default: binding
			};

		return <div className="eEvent_rival">
            <img className="eEvent_rivalPic" src={rival.get('pic')} title={rival.get('name')} alt={rival.get('name')} />
            <span className="eEvent_rivalTitle">{rival.get('name') || 'Unknown'}</span>
			{edit && owner ? <AutocompleteTeam binding={completeBinding}/> : null}
        </div>;
	},
    removePlayer: function (playerId, order) {
        var self = this,
            binding = self.getDefaultBinding(),
            participant = binding.sub('model.participants.' + order);

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
            participant = binding.sub('model.participants.' + order),
            players = participant.sub('players'),
			edit = binding.get('model.mode') === 'edit',
            closeMode = binding.get('model.mode') === 'close',
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
			mode = binding.get('model.mode') === 'edit' ? 'normal' : 'edit';

		binding.set('model.mode', mode);
	},
    onClickClose: function () {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('model.mode', 'close');
    },
    onClickCancel: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            participants = binding.sub('model.participants');

        participants.get().forEach(function (participant, index) {
            participants.sub([index, 'players']).update(function (players) {
                return players.map(function (player) {
                    return player.set('score', 0);
                });
            });
        });

        binding.set('model.mode', 'normal');
    },
    onClickFinish: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            participants = binding.sub('model.participants'),
            rivals = binding.sub('rivals');

        window.Server.results.post({eventId: binding.get('model.id')}).then(function (result) {

            participants.get().forEach(function (participant, index) {
                var participantBinding = participants.sub(index);

                participantBinding.get('players').forEach(function (player, index) {
                    player.get('scores') ? player.get('scores').forEach(function (score, scoreIndex) {
                        window.Server.pointsInResult.post(result.id, {
                            sportId: binding.get('model.sportId'),
                            studentId: player.get('id'),
                            participantId: participantBinding.get('id'),
                            eventId: binding.get('model.id'),
                            resultId: result.id,
                            score: 1
                        }).then(function (res) {
                            participantBinding.set(['players', index, 'scores', scoreIndex], Immutable.fromJS(res));
                        });
                    }) : null;
                });
            });

            binding.set('model.resultId', result.id);
            binding.set('model.type', binding.get('rivalsType') === 'schools' ? 'external' : 'internal');

            window.Server.event.get({
                eventId: binding.get('model.id')
            }).then(function (res) {
                res.resultId = result.id;

                window.Server.event.put({
                    eventId: binding.get('model.id')
                }, res).then(function (res) {

                    window.Server.result.get(res.resultId).then(function (resultModel) {
                        binding
                            .atomically()
                            .set('model.mode', 'normal')
                            .set('model.result', Immutable.fromJS(resultModel))
                            .set('model.resultId', resultModel.id)
                            .commit();
                    });
                });
            })
        });
    },
    getScore: function (order) {
        var self = this,
            binding = self.getDefaultBinding(),
            resultBinding = binding.sub('model.result'),
            closed = binding.get('model.resultId'),
            participant = binding.sub('model.participants.' + order);

        if (resultBinding.get()) {
            return <span>{resultBinding.get(['summary', 'byTeams', participant.get('id')]) || '0'}</span>;
        } else {
            return <span>-</span>;
        }
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            eventInfo = binding.sub('model'),
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
                        <span className="eEvent_edit" onClick={self.onClickEdit}>{!edit ? 'edit' : 'normal'}</span> : null}
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
