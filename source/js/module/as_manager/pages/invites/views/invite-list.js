/**
 * Created by Anatoly on 16.11.2016.
 */
const   Invite          = require('./invite'),
		ProcessingView  = require('./processing'),
		Promise 		= require('bluebird'),
		inviteActions 	= require('./invite-actions'),
		React           = require('react'),
		Morearty		= require('morearty'),
		Immutable       = require('immutable'),
		Bootstrap  	    = require('styles/bootstrap-custom.scss');

/** Component to show all box invites */
const InviteList = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		type: React.PropTypes.oneOf(['inbox', 'outbox', 'archive'])
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

		inviteActions.loadData(activeSchoolId, this.props.type).then(invites => {
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

			return (
				<Invite	key			={reactKey}
						type		= {self.props.type}
						binding		= {inviteBinding}
						onDecline	= {this.onDecline}
				/>
			);
		}).toArray();
	},
	onDecline:function (inviteId, commentText) {
		const
			binding 		= this.getDefaultBinding(),
			rootBinding 	= this.getMoreartyContext().getBinding(),
			activeSchoolId 	= rootBinding.get('userRules.activeSchoolId');

		inviteActions.declineInvite(activeSchoolId, inviteId, binding, commentText);
	},
	render: function() {
		const	self 	= this,
				binding = self.getDefaultBinding(),
				invites = self.getInvites();

		return (
			<div>
				<div className="eInvites_filterPanel"></div>
				<div className="eInvites_list container" >{invites && invites.length ? invites : null}</div>
				<ProcessingView binding={binding} />
			</div>
		);
	}
});


module.exports = InviteList;
