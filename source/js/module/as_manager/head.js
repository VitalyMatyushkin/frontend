const 	Logo 		= require('module/as_manager/head/logo'),
		TopMenu 	= require('module/ui/menu/top_menu'),
		UserBlock 	= require('module/shared_pages/head/user_block'),
		If 			= require('module/ui/if/if'),
		React 		= require('react');

const Head = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function() {
        this.schoolExists();
	},
    componentDidMount:function(){
        const self = this,
            binding = self.getDefaultBinding();

        self.addBindingListener(binding, 'userRules.activeSchoolId', self.createTopMenu);
        self.addBindingListener(binding, 'userData.authorizationInfo.role', self.schoolExists);
    },
    schoolExists:function(){
        const self = this,
            globalBinding   = self.getMoreartyContext().getBinding(),
            activeSchoolId  = globalBinding.get('userRules.activeSchoolId'),
            authorization   = globalBinding.get('userData.authorizationInfo.id');

        if(activeSchoolId && authorization)
            return window.Server.school.get(activeSchoolId).then(function (data) {
                self.createTopMenu();
            }).catch(() => {
                globalBinding.set('userRules.activeSchoolId', '');
            });
    },
	createTopMenu: function() {
        const self = this,
            binding = self.getDefaultBinding(),
            globalBinding = self.getMoreartyContext().getBinding(),
            activeSchoolId = globalBinding.get('userRules.activeSchoolId'),
		    menuItems = [
			{
				href: '/#school_admin/summary',
				icon: '',
				name: 'School',
				key: 'School',
				routes: ['/school_admin/:subPage', '/school_admin/:subPage/:mode', '/schools/add', '/schools'],
				authorization: true,
				verified: true
			}, {
				href: '/#events/calendar',
				icon: '',
				name: 'Events',
				key: 'Events',
				routes: ['/events/:subPage'],
				authorization: true,
				verified: true
			},
			{
				href: '/#invites/inbox',
				icon: '',
				name: 'Invites',
				key: 'Invites',
				routes: ['/invites', '/invites/:filter', '/invites/:inviteId/:mode'],
				authorization: true,
				verified: true
			}, {
				href: '/#school_console/users',
				icon: '',
				name: 'Console',
				key: 'Console',
				routes: ['/school_console/:subPage', '/school_console/:filter', '/school_console/:inviteId/:mode'],
				authorization: true,
				verified: true
			}
		];

        if(activeSchoolId)
            binding.set('topMenuItems', menuItems);
        else binding.clear('topMenuItems');
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();
		return (
			<div className="bTopPanel">
				<Logo />
                <TopMenu binding={{default: binding.sub('routing'), itemsBinding:binding.sub('topMenuItems')}}/>
				<If condition={document.location.hash.indexOf('login') === -1}>
					<UserBlock binding={binding.sub('userData')}/>
				</If>
			</div>
		)
	}
});

module.exports = Head;
