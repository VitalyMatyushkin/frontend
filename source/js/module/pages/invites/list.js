var SVG = require('module/ui/svg'),
	Manager = require('module/ui/managers/manager'),
    EventsView;

EventsView = React.createClass({
	mixins: [Morearty.Mixin],
    getDefaultState: function () {
        return Immutable.fromJS({
            selectInvitesType: 'inbox',
            selectInviteAccepted: null,
            stepInviteAccepted: 0
        });
    },
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

			rivals.unshift({id: invite.get('invitedId')});

			binding
				.set('inviteEvent', Immutable.fromJS(res));

			binding.sub('inviteEvent')
				.atomically()
				.set('rivals', Immutable.fromJS(rivals))
				.commit();

			binding.set('stepInviteAccepted', 1);

			window.Server.schools.get({
				filter: {
					where: {
						id: {
							inq: [invite.get('invitedId'), invite.get('inviterId')]
						}
					}
				}
			}).then(function (res) {
				binding.merge('inviteEvent.rivals', Immutable.fromJS(res));
			});
		});
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
			players = binding.get('inviteEvent.rivals.0.players'),
			activeSchoolId = this.getMoreartyContext().getBinding().get('userRules.activeSchoolId');

		window.Server.participants.post({eventId: eventBinding.get('id')}, {
			eventId: eventBinding.get('id'),
			schoolId: binding.get('selectInviteAccepted.invitedId'),
			rivalsType: 'school'
		}).then(function (res) {
			players.forEach(function (player) {
				window.Server.playersRelation.put({
					teamId: res.id,
					learnerId: player.get('id')
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
	getInvites: function () {
		var self = this,
            binding = this.getDefaultBinding(),
            activeSchoolId = this.getMoreartyContext().getBinding().get('userRules.activeSchoolId'),
            selectInvitesType = binding.get('selectInvitesType'),
			inviteCount = binding.get('models').count(),
            filtered = binding.get('models').filter(function (invite) {
                return selectInvitesType === 'inbox' || selectInvitesType === undefined ?
                invite.get('invitedId') === activeSchoolId :
                invite.get('inviterId') === activeSchoolId;
            });

		if (inviteCount > 0) {
			return filtered.map(function (invite) {
                var date = new Date(invite.get('meta').get('created')),
                    inbox = invite.get('invitedId') === activeSchoolId,
                    acceptedText = invite.get('accepted') ? 'accepted' : 'declined',
                    dateTime = [date.getMonth(), date.getDate(), date.getFullYear()].join('/');

				return <div className="bInvite">
                    <div className="eInvite_title">{dateTime}</div>
                    <span className="eInvite_invited">Invited: {invite.get('invitedId')}</span>
                    <span className="eInvite_inviter">Inviter: {invite.get('inviterId')}</span>
                    <span className="eInvite_type">Type: {invite.get('invitedType')}</span>
                    <div className="eInvite_messages">Message: {invite.get('message')}</div>
                    <span className="eInvite_redeemed">redeemed: {invite.get('redeemed') ? 'redeemed' : 'not redeemed'}</span>
                    <div className="eInvite_overlay">
                        <SVG icon="icon_check" classes={invite.get('accepted') ? 'eInvite_accept mAccept' : 'eInvite_accept'} />
                    </div>
                      <div className="eInvite_buttons">
                        {inbox && !invite.get('repaid') ? <span className="bButton" onClick={self.onClickAccept.bind(null, invite)}>Accept</span> : null}
                        {inbox && !invite.get('repaid') ? <span className="bButton" onClick={self.onClickDecline.bind(null, invite)}>Decline</span> : null}
                        {invite.get('repaid') ? <span className="bButton mDisable">{acceptedText.toUpperCase()}</span> : null}
                      </div>
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
			players = binding.get('inviteEvent.rivals.0.players'),
			disableAcceptButton = !players ||
				players.count() < binding.get('inviteEvent.sport.players.min') ||
				players.count() > binding.get('inviteEvent.sport.players.max'),
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
            {!step ? <div>
                <div className="bChooser">
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
