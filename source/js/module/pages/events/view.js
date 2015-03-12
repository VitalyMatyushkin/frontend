var EventView;

EventView = React.createClass({
	mixins: [Morearty.Mixin],
    componentWillMount: function () {
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
			routerParameters = rootBinding.toJS('routing.parameters');

		window.Server.eventFindOne.get({
            filter: {
                include: [
                    {
                        participants: 'players'
                    },
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
                .set('editMode', false);

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
                    binding.merge('eventInfo.participants.' + index, Immutable.fromJS(res));
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
            var month = '0'+month;
        }
        if(day.toString().length == 1) {
            var day = '0'+day;
        }
        if(hour.toString().length == 1) {
            var hour = '0'+hour;
        }
        if(minute.toString().length == 1) {
            var minute = '0'+minute;
        }
        if(second.toString().length == 1) {
            var second = '0'+second;
        }
        var dateTime = year+'/'+month+'/'+day+' '+hour+':'+minute+':'+second;
        return dateTime;
    },
	getRival: function (order) {
		var self = this,
			binding = self.getDefaultBinding(),
			rival = binding.sub('eventInfo.participants.' + order);

		return <div className="eEvent_rival">
            <img className="eEvent_rivalPic" src={rival.get('pic')} title={rival.get('name')} alt={rival.get('name')} />
            <span className="eEvent_rivalTitle">{rival.get('name') || 'Unknown'}</span>
        </div>;
	},
    getPlayers: function (order) {
        var self = this,
            binding = self.getDefaultBinding(),
            rival = binding.sub('eventInfo.participants.' + order),
            players = rival.get('players');

        if (players) {
            return players.map(function (player) {
                return <span className="bPlayer">
                    <img className="ePlayer_avatar" src={player.get('avatar')} />
                    <span className="ePlayer_name">{player.get('firstName')}</span>
                    <span className="ePlayer_lastName">{player.get('lastName')}</span>
                </span>;
            }).toArray();
        } else {
            return null;
        }
    },
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            routerParameters = rootBinding.toJS('routing.parameters'),
            eventInfo = binding.sub('eventInfo'),
            date = eventInfo.get('startTime') ? self.getDateTime(eventInfo.get('startTime')) : '';

		return <div className="bEvents">
            <div className="bEvent">
                <h2 className="eEvent_title">{eventInfo.get('name')}</h2>
                <h3 className="eEvent_date">Start: {date}</h3>
				<div className="eEvent_rivals">
					{self.getRival(0)}
					<div className="eEvent_info">
                        <span className="eEvent_infoItem mScore">0 - 0</span>
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
		</div>;
	}
});


module.exports = EventView;
