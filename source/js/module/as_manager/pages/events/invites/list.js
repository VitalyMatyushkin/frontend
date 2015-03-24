var SVG = require('module/ui/svg'),
	Manager = require('module/ui/managers/manager'),
    EventsView;

EventsView = React.createClass({
	mixins: [Morearty.Mixin],
    onSelectInviteType: function (type) {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('selectInvitesType', type);
    },
    onClickAccept: function (invite) {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('selectInviteAccepted', invite);

		window.Server.eventFindOne.get({
			filter: {
				where: {id: invite.get('eventId')},
				include: [
					{
						participants: 'players'
					},
					'sport'
				]
			}
		}).then(function (res) {
			var rivals = res.participants;

			rivals.unshift({id: invite.get('guestId'), players: []});

			binding.set('inviteEvent', Immutable.fromJS(res));
			binding
                .set('inviteEvent.rivals', Immutable.fromJS(rivals))
                .set('stepInviteAccepted', 1);

			window.Server.schools.get({
				filter: {
					where: {
						id: {
							inq: [invite.get('guestId'), invite.get('inviterId')]
						}
					}
				}
			}).then(function (res) {
                var rivals = Immutable.fromJS(res).sort(function(rival) {
                    return rival.get('id') === invite.get('guestId') ? 1 : -1;
                });

				binding
                    .atomically()
                    .merge('inviteEvent.rivals', rivals)
                    .set('inviteEvent.rivals.0.players', Immutable.List())
                    .set('inviteEvent.rivals.1.players', Immutable.List())
                    .commit();
			});
		});
    },
	onClickRedeemed: function (invite) {
		var self = this,
			binding = self.getDefaultBinding(),
			invitesBinding = binding.sub('models'),
			findIndex = invitesBinding.get().findIndex(function (model) {
				return model.get('id') === invite.get('id');
			});

		invitesBinding.set(findIndex + '.redeemed', true);

		window.Server.invite.put({
			inviteId: invite.get('id')
		}, invitesBinding.toJS(findIndex));
	},
    onClickDecline: function (invite) {
        window.Server.inviteRepay.post({
            inviteId: invite.get('id')
        }, {
            accepted: false
        }).then(function (res) {
            console.log(res);
        })
    },
	toAccept: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			eventBinding = binding.sub('inviteEvent'),
			players = binding.get('inviteEvent.rivals.1.players'),
			activeSchoolId = this.getMoreartyContext().getBinding().get('userRules.activeSchoolId');

		window.Server.participants.post({eventId: eventBinding.get('id')}, {
			eventId: eventBinding.get('id'),
			schoolId: binding.get('selectInviteAccepted.guestId'),
			rivalsType: 'school'
		}).then(function (res) {
			players.forEach(function (player) {
				window.Server.playersRelation.put({
					teamId: res.id,
					studentId: player.get('id')
				}).then(function (res) {
					console.log(res);
				});
			});

			window.Server.inviteRepay.post({
				inviteId: binding.get('selectInviteAccepted.id')
			}, {
				teamId: res.id,
				accepted: true
			}).then(function (res) {
				var index = binding.get('models').findIndex(function (invite) {
					return invite.get('id' === binding.get('selectInviteAccepted.id'))
				});

				if (index) {
					binding.merge('models.' + index, Immutable.fromJS(res))
				}

				binding.set('stepInviteAccepted', 0);
				document.location.hash = 'events/view?id=' + eventBinding.get('id');
			});
		});
	},
	_zeroFill: function (i) {
		return (i < 10 ? '0' : '') + i;
	},
	getInvites: function () {
		var self = this,
            binding = this.getDefaultBinding(),
            activeSchoolId = self.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
            selectInvitesType = binding.get('selectInvitesType') || 'inbox',
			inviteCount = binding.get('models').count(),
            filtered = binding.get('models').filter(function (invite) {
                return selectInvitesType === 'inbox' || selectInvitesType === undefined ?
                invite.get('guestId') === activeSchoolId :
                invite.get('inviterId') === activeSchoolId;
            });

		if (inviteCount > 0) {
			return filtered.map(function (invite) {
                var date = new Date(invite.get('meta').get('created')),
                    inbox = invite.get('guestId') === activeSchoolId,
                    acceptedText = invite.get('accepted') ? 'accepted' : 'declined',
                    onlyDate = [self._zeroFill(date.getMonth()), self._zeroFill(date.getDate()), self._zeroFill(date.getFullYear())].join('/'),
					time = [self._zeroFill(date.getHours()), self._zeroFill(date.getMinutes())].join(':'),
					inviter = invite.get('inviter'),
					invited = invite.get('invited'),
					inviteClass = classNames({
						bInvite: true,
						mNotRedeemed: !invite.get('redeemed') && selectInvitesType === 'inbox',
						mRepaid: invite.get('repaid')
					});

				return <div className={inviteClass}>
                    <div className="eInvite_header">
						<span className="eInvite_eventName">{inviter && inviter.get('name')} <span className="eInvite_vs">VS</span> {invited && invited.get('name')}</span>
						<span className="eInvite_eventDate">{onlyDate + ' - ' + time}</span>
					</div>
					<div className="eInvite_message">{selectInvitesType === 'inbox' ? invite.get('message') : 'Awaiting opponent...'}</div>
					<div className="eInvite_buttons">
						{inbox && !invite.get('repaid') ? <span className="bButton" onClick={self.onClickAccept.bind(null, invite)}>Accept</span> : null}
						{inbox && !invite.get('repaid') ? <span className="bButton mRed" onClick={self.onClickDecline.bind(null, invite)}>Decline</span> : null}
						{invite.get('repaid') ? <span className="bButton mDisable">{acceptedText.toUpperCase()}</span> : null}
					</div>
					{selectInvitesType === 'inbox' ? <span className="eInvite_close" onClick={self.onClickRedeemed.bind(null, invite)}></span> : null}
				</div>;
			}).toArray();
		} else {
			return null;
		}
	},
	render: function() {
		var self = this,
            binding = self.getDefaultBinding(),
            step = binding.get('stepInviteAccepted'),
            selectInvitesType = binding.get('selectInvitesType'),
			players = binding.get('inviteEvent.rivals.1.players'),
            countPlayers = players ? players.count() : 0,
			disableAcceptButton = !players ||
                countPlayers < binding.get('inviteEvent.sport.players.min') ||
                countPlayers > binding.get('inviteEvent.sport.players.max'),
            inboxClasses = classNames({
                eChooser_item: true,
                mActive: selectInvitesType === 'inbox' || selectInvitesType === undefined
            }),
            outboxClasses = classNames({
                eChooser_item: true,
                mActive: selectInvitesType === 'outbox'
            }),
			finishButtonClasses = classNames({
				bButton: true,
				mDisable: disableAcceptButton
			});


        return <div className="bInvites">
            {step === 0 ? <div>
                <div className="bChooser mLong">
                    <span className={inboxClasses} onClick={self.onSelectInviteType.bind(null, 'inbox')}>Inbox</span>
                    <span className={outboxClasses} onClick={self.onSelectInviteType.bind(null, 'outbox')}>Outbox</span>
                </div>
                {self.getInvites()}
            </div>: null}
            {step === 1 ? <div>
				<Manager binding={binding.sub('inviteEvent')} />
				<span className={finishButtonClasses} onClick={!disableAcceptButton ? self.toAccept : null}>Accept</span>
            </div>: null}
        </div>;
	}
});


module.exports = EventsView;
