var InvitesView,
    RouterView = require('module/core/router'),
    Route = require('module/core/route');

InvitesView = React.createClass({
	mixins: [Morearty.Mixin],
	getMergeStrategy: function () {
		return Morearty.MergeStrategy.MERGE_REPLACE;
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			sync: false,
			models: [],
			participants: []
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
							invitedId: activeSchoolId
						}
					],
					repaid: {
						neq: true
					}
				}
			}
		}).then(function (models) {

			var uniqueIds = models.reduce(function (memo, invite) {
				if (memo.indexOf(invite.inviterId) === -1) {
					memo.push(invite.inviterId);
				}

				if (memo.indexOf(invite.invitedId) === -1) {
					memo.push(invite.invitedId);
				}

				return memo;
			}, []);

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
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
            metaBinding = binding.meta(),
            currentPath = metaBinding.get('routing.currentPath'),
            classes = {
				inbox: classNames({
                    eSubMenu_item: true,
                    mActive: currentPath === '/invites/inbox' || currentPath === '/invites'
                }),
				outbox: classNames({
                    eSubMenu_item: true,
                    mActive: currentPath === '/invites/outbox'
                }),
				repaid: classNames({
                    eSubMenu_item: true,
                    mActive: currentPath === '/invites/repaid'
                })
            };

		return <div>
            <div className='bSubMenu'>
                <a href='#invites/inbox' className={classes.inbox}>Inbox</a>
                <a href='#invites/outbox' className={classes.outbox}>Outbox</a>
                <a href='#invites/repaid' className={classes.repaid}>Repaid</a>
            </div>
            <div className='bInvites'>
                <RouterView routes={ metaBinding.sub('routing') } binding={binding}>
					<Route path='/invites' binding={binding} component='module/pages/invites/views/inbox'  />
                    <Route path='/invites/inbox' binding={binding} component='module/pages/invites/views/inbox'  />
                    <Route path='/invites/outbox'  binding={binding}component='module/pages/invites/views/outbox'   />
                    <Route path='/invites/repaid' binding={binding} component='module/pages/invites/views/repaid'  />
                </RouterView>
            </div>
        </div>;
	}
});


module.exports = InvitesView;
