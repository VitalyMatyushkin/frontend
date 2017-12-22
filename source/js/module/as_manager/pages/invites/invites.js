const 	RouterView 			= require('module/core/router'),
		Route 				= require('module/core/route'),
		React 				= require('react'),
		Immutable 			= require('immutable'),
		Morearty			= require('morearty'),
		{SubMenu} 			= require('module/ui/menu/sub_menu'),
		InboxComponent 		= require('module/as_manager/pages/invites/views/inbox'),
		OutboxComponent 	= require('module/as_manager/pages/invites/views/outbox'),
		ArchiveComponent 	= require('module/as_manager/pages/invites/views/archive'),
		AcceptComponent 	= require('module/as_manager/pages/invites/views/accept');

const SchoolHelper = require('module/helpers/school_helper');

const EventFormConsts = require('module/as_manager/pages/events/manager/event_form/consts/consts');

const InvitesView = React.createClass({
	mixins: [Morearty.Mixin],
	activeSchoolId: undefined,
	propTypes: {
		schoolType: React.PropTypes.string.isRequired
	},
	getDefaultProps: function() {
		return {
			schoolType: EventFormConsts.EVENT_FORM_MODE.SCHOOL
		};
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			inbox: {
				models: [],
				sync: false
			},
			outbox: {},
			archive: {},
			decline: {
				type: 'decline'
			},
			cancel: {
				type: 'cancel'
			},
			invitesRouting: {},
			selectedRivalIndex: 0
		});
	},
	componentWillMount: function () {
		const	self			= this,
				rootBinding		= self.getMoreartyContext().getBinding(),
				activeSchoolId	= rootBinding.get('userRules.activeSchoolId');

		this.activeSchoolId = activeSchoolId;

		self.menuItems = [];
		if(self.props.schoolType === EventFormConsts.EVENT_FORM_MODE.SCHOOL) {
			self.menuItems.push(
				{
					href: '/#invites/inbox',
					name: 'Inbox',
					key: 'Inbox'
				}
			);
		}
		self.menuItems.push(
			{
				href: '/#invites/outbox',
				name: 'Outbox',
				key: 'Outbox'
			}, {
				href: '/#invites/archive',
				name: 'Archive',
				key: 'Archive'
			}
		);

		SchoolHelper.loadActiveSchoolInfo(this);
	},
	getAcceptBinding: function() {
		const binding = this.getDefaultBinding();

		return {
			default:	binding.sub('accept'),
			models:		binding.sub('inbox.models')
		};
	},
	render: function() {
		const 	self 			= this,
				binding	 		= self.getDefaultBinding(),
				globalBinding 	= self.getMoreartyContext().getBinding();

		return (
			<div>
				<SubMenu
					binding	= {binding.sub('invitesRouting')}
					items	= {self.menuItems}
				/>
				<div className='bSchoolMaster'>
					<div className='bInvites'>
						<RouterView routes={ binding.sub('invitesRouting') } binding={globalBinding}>
							<Route path='/invites /invites/inbox'		binding={binding.sub('inbox')}		component={InboxComponent} />
							<Route path='/invites/outbox' 				binding={binding.sub('outbox')} 	component={OutboxComponent} />
							<Route path='/invites/archive' 				binding={binding.sub('archive')} 	component={ArchiveComponent} />
							<Route
								path			= '/invites/:inviteId/accept'
								binding			= { this.getAcceptBinding() }
								activeSchoolId	= { this.activeSchoolId }
								component		= { AcceptComponent }
							/>
						</RouterView>
					</div>
				</div>
			</div>
		);
	}
});


module.exports = InvitesView;
