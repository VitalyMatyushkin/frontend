const	ProcessingView 	= require('./processing'),
		Invite 			= require('./invite'),
		React 			= require('react'),
		Immutable 		= require('immutable'),
		Promise 		= require('bluebird'),
		MoreartyHelper	= require('module/helpers/morearty_helper'),
		Morearty		= require('morearty');

const OutboxView = React.createClass({
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
		const 	self 	= this,
				binding = self.getDefaultBinding();

		self.activeSchoolId = MoreartyHelper.getActiveSchoolId(self);

		let outboxInvites;
		
		window.Server.schoolOutboxInvites.get(self.activeSchoolId, { filter: { limit: 100 }})
		.then( allInvites => {
			outboxInvites = allInvites;
			return window.Server.school.get(self.activeSchoolId);
		})
		.then(activeSchool => {
			return Promise.all(
				outboxInvites.map(invite =>
					// inject schoolInfo to invite
					window.Server.publicSchool.get(invite.invitedSchoolId)
						.then(invitedSchool => {
							invite.inviterSchool = activeSchool;
							invite.invitedSchool = invitedSchool;

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
			outboxInvites = outboxInvites.sort((a,b) => {
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
				.set('models', Immutable.fromJS(outboxInvites))
				.commit();

			return outboxInvites;
		});
	},
	getInvites: function () {
		const 	self 	= this,
				binding = self.getDefaultBinding(),
				invites = binding.get('models');

		return invites.map(function (invite, index) {
			const inviteBinding = {
				default: 		binding.sub(['models', index]),
				inviterSchool: 	binding.sub(['models', index, 'inviterSchool']),
				invitedSchool: 	binding.sub(['models', index, 'invitedSchool'])
			};

			return <Invite key={invite.get('id')} type="outbox" binding={inviteBinding} />;
		}).toArray();
	},
	render: function() {
		const 	self 	= this,
				binding = self.getDefaultBinding(),
				invites = self.getInvites();

		return (
			<div className="eInvites_OutboxContainer">
				<div className="eSchoolMaster_wrap">
					<h1 className="eSchoolMaster_title">Outbox</h1>
					<div className="eStrip">
					</div>
				</div>
				<div className="eInvites_filterPanel"></div>
				<div className="eInvites_list" >{invites && invites.length ? invites : null}</div>
				<ProcessingView binding={binding} />
			</div>
		);
	}
});


module.exports = OutboxView;
