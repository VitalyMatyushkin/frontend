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

const 	{ MessagesLoader }	= require('module/ui/message_list/messages_loader'),
		InfiniteScroll		= require('react-infinite-scroller');

/** Component to show all box invites */
const InviteList = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		type: React.PropTypes.oneOf(['inbox', 'outbox', 'archive'])
	},
	componentWillMount: function () {
		const 	binding 		= this.getDefaultBinding(),
				rootBinding 	= this.getMoreartyContext().getBinding(),
				activeSchoolId 	= rootBinding.get('userRules.activeSchoolId');

		binding
			.atomically()
			.set('hasMore', true)
			.set('models', Immutable.fromJS([]))
			.commit();
	},
	loadInvites: function (page) {
		const 	binding 		= this.getDefaultBinding(),
				rootBinding 	= this.getMoreartyContext().getBinding(),
				activeSchoolId 	= rootBinding.get('userRules.activeSchoolId');
		
		return inviteActions.loadData(page, activeSchoolId, this.props.type).then(_invites => {
			let invites = binding.toJS('models');
			invites = invites.concat(_invites);
			const hasMore = _invites.length !== 0;
			binding
				.atomically()
				.set('hasMore', hasMore)
				.set('models', Immutable.fromJS(invites))
				.commit();
			
			return true;
		});
	},
	renderInvites: function () {
		const 	binding = this.getDefaultBinding(),
				invites = binding.toJS('models');
		let invitesList = [];

		if(
			invites !== 'undefined' &&
			invites.length > 0
		) {
			invitesList = invites.map((invite, index) => {
				const inviteBinding = {
					default: binding.sub(['models', index]),
					inviterSchool: binding.sub(['models', index, 'inviterSchool']),
					invitedSchool: binding.sub(['models', index, 'invitedSchool'])
				};

				const reactKey = inviteBinding.default.toJS().id;

				return (
					<Invite
						key={reactKey}
						type={this.props.type}
						binding={inviteBinding}
						onDecline={this.onDecline}
					/>
				);
			})
		}
		return invitesList;
	},
	onDecline:function (inviteId, commentText) {
		const
			binding 		= this.getDefaultBinding(),
			rootBinding 	= this.getMoreartyContext().getBinding(),
			activeSchoolId 	= rootBinding.get('userRules.activeSchoolId');

		inviteActions.declineInvite(activeSchoolId, inviteId, binding, commentText);
	},
	render: function() {
		const	binding = this.getDefaultBinding(),
				hasMore = binding.toJS('hasMore'),
				invites = binding.toJS('models');
		
		let content = null;
		
		if(
			invites.length === 0 &&
			!hasMore
		) {
			content = (
				<div className="eInvites_processing">
					<span>There are no messages to display.</span>
				</div>
			);
		} else {
			content = (
				<InfiniteScroll
					pageStart	= { 0 }
					loadMore	= { page => this.loadInvites(page) }
					hasMore		= { hasMore }
					loader		= { <MessagesLoader/> }
				>
					<div className="eInvites_list container" >
						{this.renderInvites()}
					</div>
				</InfiniteScroll>
			);
		}
		
		return content;
	}
});


module.exports = InviteList;
