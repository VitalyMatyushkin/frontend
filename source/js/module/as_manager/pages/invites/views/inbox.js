const   Invite          = require('./invite'),
        ProcessingView  = require('./processing'),
		If				= require('module/ui/if/if'),
		Promise 		= require('bluebird'),
        React           = require('react'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		Morearty		= require('morearty'),
        Immutable       = require('immutable');

/** Component to show all inbox invites */
const InboxView = React.createClass({
    mixins: [Morearty.Mixin],
	// ID of current school
	// Will set on componentWillMount event
	activeSchoolId: undefined,
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
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				rootBinding 	= self.getMoreartyContext().getBinding(),
				activeSchoolId 	= rootBinding.get('userRules.activeSchoolId');

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		let inboxInvites;

		window.Server.schoolInboxInvites.get(self.activeSchoolId, { filter: { limit: 100 }})
		.then( allInvites => {
			inboxInvites = allInvites;
			return window.Server.school.get(self.activeSchoolId);
		})
		.then(activeSchool => {				//TODO: optimize this. Move all this to server? Or just stay here, but make parallel?
			return Promise.all(
				inboxInvites.map(invite =>
					// inject schoolInfo to invite
					window.Server.publicSchool.get(invite.inviterSchoolId)
					.then(inviterSchool => {
						invite.inviterSchool = inviterSchool;
						invite.invitedSchool = activeSchool;

						// inject event to invite
						return window.Server.schoolEvent.get({schoolId: self.activeSchoolId, eventId: invite.eventId});
					})
					.then(event => {
						invite.event = event;

						// inject sport to invite
						return window.Server.sport.get(event.sportId).then(sport => {
							invite.sport = sport;
							return sport;
						})
					})
				)
			);
		})
		.then(_ => {
			inboxInvites = inboxInvites.sort((a,b) => {
				const _a = a.event.startTime,
					_b = b.event.startTime;

				if(_a < _b){
					return -1;
				}
				if(_a > _b){
					return 1;
				}
				return 0;
			});
            binding
                .atomically()
                .set('sync', true)
                .set('models', Immutable.fromJS(inboxInvites))
                .set('findParticipantfindParticipant', Immutable.fromJS([]))// TODO to deal with this shit
                .commit();

            return inboxInvites;
		});
	},
    getInvites: function () {
        const 	self 	= this,
				binding = self.getDefaultBinding(),
				invites = binding.get('models');

        return invites.map((invite, index) => {
            const inviteBinding = {
				default: 		binding.sub(['models', index]),
				inviterSchool: 	binding.sub(['models', index, 'inviterSchool']),
				invitedSchool: 	binding.sub(['models', index, 'invitedSchool'])
			};

			const reactKey = inviteBinding.default.toJS().id;

            return <Invite key={reactKey} type="inbox"  binding={inviteBinding} />;
        }).toArray();
    },
    render: function() {
        const 	self 	= this,
				binding = self.getDefaultBinding(),
				isSync	= binding.get('sync'),
				invites = self.getInvites();

        return (
			<div className="eInvites_inboxContainer">
				<div className="eSchoolMaster_wrap">
					<h1 className="eSchoolMaster_title">Inbox</h1>
					<div className="eStrip"></div>
				</div>
				<div>
					<div className="eInvites_filterPanel"></div>
					<div className="eInvites_list" >{invites && invites.length ? invites : null}</div>
				</div>
				<ProcessingView binding={binding} />
        	</div>
		);
    }
});


module.exports = InboxView;
