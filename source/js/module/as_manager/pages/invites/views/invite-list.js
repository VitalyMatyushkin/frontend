/**
 * Created by Anatoly on 16.11.2016.
 */
const   Invite          = require('./invite'),
	ProcessingView  = require('./processing'),
	Promise 		= require('bluebird'),
	inviteActions 	= require('./invite-actions'),
	React           = require('react'),
	Morearty		= require('morearty'),
	Immutable       = require('immutable');

/** Component to show all inbox invites */
const InboxView = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			models: [],
			sync: false
		});
	},
	componentWillMount: function () {
		const 	self 			= this,
				binding 		= self.getDefaultBinding(),
				rootBinding 	= self.getMoreartyContext().getBinding(),
				activeSchoolId 	= rootBinding.get('userRules.activeSchoolId');

		binding
			.atomically()
			.set('sync', false)
			.set('models', Immutable.fromJS([]))
			.commit();

		inviteActions.loadData(activeSchoolId, this.props.type)
			.then(invites => {
				binding
					.atomically()
					.set('sync', true)
					.set('models', Immutable.fromJS(invites))
					.commit();

				return invites;
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

			return <Invite key={reactKey} type={self.props.type}  binding={inviteBinding} />;
		}).toArray();
	},
	render: function() {
		const 	self 	= this,
			binding = self.getDefaultBinding(),
			invites = self.getInvites();

		return (
			<div className="eInvites_inboxContainer">
				<div className="eSchoolMaster_wrap">
					<h1 className="eSchoolMaster_title">{this.props.type}</h1>
					<div className="eStrip"></div>
				</div>
				<div className="eInvites_filterPanel"></div>
				<div className="eInvites_list" >{invites && invites.length ? invites : null}</div>
				<ProcessingView binding={binding} />
			</div>
		);
	}
});


module.exports = InboxView;
