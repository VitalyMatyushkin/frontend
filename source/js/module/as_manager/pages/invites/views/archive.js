var OutboxView,
	ProcessingView = require('./processing'),
	InviteOutbox = require('./invite'),
	InvitesMixin = require('../mixins/invites_mixin');

OutboxView = React.createClass({
	mixins: [Morearty.Mixin, InvitesMixin],
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			models: [],
			participants: [],
			sync: false
		});
	},
	componentWillMount: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			rootBinding = self.getMoreartyContext().getBinding(),
			activeSchoolId = rootBinding.get('userRules.activeSchoolId');

		window.Server.invites.get({
			filter: {
				where: {
					or: [
						{
							inviterId: activeSchoolId
						},
						{
							guestId: activeSchoolId
						}
					],
					accepted: {
                        inq: [true, false]
                    }
				},
                include: ['inviter', 'guest']
			}
		}).then(function (models) {
			var uniqueIds = models.reduce(function (memo, invite) {
				if (memo.indexOf(invite.inviterId) === -1) {
					memo.push(invite.inviterId);
				}

				return memo;
			}, []);

			if (uniqueIds.length > 0) {
				window.Server.schools.get({
					filter: {
						where: {
							id: {
								inq: uniqueIds
							}
						}
					}
				}).then(function (participants) {
					binding
						.atomically()
						.set('sync', true)
						.set('models', Immutable.fromJS(models))
						.set('participants', Immutable.fromJS(participants))
						.commit();
				});
			}
		});
	},
	getInvites: function () {
		var self = this,
			binding = self.getDefaultBinding(),
			invites = binding.get('models');

		return invites.map(function (invite, index) {
			var inviterIndex = self.findIndexParticipant(invite.get('inviterId')),
				invitedIndex = self.findIndexParticipant(invite.get('guestId')),
				inviteBinding = {
					default: binding.sub(['models', index]),
					inviter: binding.sub(['participants', inviterIndex]),
					invited: binding.sub(['participants', invitedIndex])
				};

			return <InviteOutbox binding={inviteBinding} />;
		}).toArray();
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			invites = self.getInvites();

		return <div key={'inbox-view'} className="eInvites_OutboxContainer">
			<h2 className="eInvites_titlePage">Repaid</h2>
			<div className="eInvites_filterPanel"></div>
			<div className="eInvites_list">{invites && invites.length ? invites : 'You don\'t have invites'}</div>
		</div>;
	}
});


module.exports = OutboxView;
