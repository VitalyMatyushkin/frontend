const	React						= require('react'),
		Morearty					= require('morearty'),
		Immutable					= require('immutable'),
		RouterView					= require('module/core/router'),
		Route						= require('module/core/route');

const	SubMenu						= require('module/ui/menu/sub_menu'),
		UserListWrapper				= require('./pages/user_list_wrapper'),
		UserRequestList				= require('./pages/user_request_list'),
		UserRequestListArchive		= require('./pages/user_request_list_archive'),
		UserViewComponent			= require('../../../../shared_pages/users/user_view'),
		FavouriteSportPageWrapper	= require('module/shared_pages/sport_pages/favourite_sports/favourite_sport_page_wrapper'),
		MoreartyHelper				= require('module/helpers/morearty_helper');

const	SchoolUnionConsoleStyle		= require('../../../../../../styles/ui/b_school_union_console.scss');

const SchoolUnionConsole = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			permissions			: {},
			requests			: {},
			decline				: {
				type: 'decline'
			},
			cancel				: {
				type: 'cancel'
			},
			consoleRouting		: {},
			subMenuItems		: {},
			parentPermission	: {},
			favoriteSports		: {},
			moderation			: {
				moderationForm: {

				}
			}
		});
	},
	componentWillMount: function () {
		window.Server.school.get(MoreartyHelper.getActiveSchoolId(this))
			.then(school => {
				this.activeSchoolInfo = school;

				return this.createSubMenu();
			})
			.then(() => {
				this.getDefaultBinding().set('isSync', true);
			});
	},
	setSubMenuItems: function(count) {
		const binding = this.getDefaultBinding();

		let menuItems = [{
			href	: '/#school_union_console/users',
			name	: 'Users & Permissions',
			key		: 'Users'
		},{
			href	: '/#school_union_console/requests',
			name	: 'New Requests',
			key		: 'requests',
			num		: '(' + count + ')'
		},{
			href	: '/#school_union_console/archive',
			name	: 'Requests Archive',
			key		: 'archive'
		}];

		if (this.activeSchoolInfo.canEditFavoriteSports) {
			menuItems.push({
				href:	'/#school_union_console/sports',
				name:	'Sports',
				key:	'sports'
			});
		}

		binding.set('subMenuItems', Immutable.fromJS(menuItems));
	},
	createSubMenu: function() {
		const self = this;

		//Get the total number of permissions (Notification badge) in submenu
		return window.Server.permissionRequests.get(
				MoreartyHelper.getActiveSchoolId(self),
				{
					filter: {
						limit: 1000,
						where: {
							status: 'NEW'
						}
					}
				}
			)
			.then(permissions => {
				this.setSubMenuItems(permissions.length);

				// yep, always i'm right
				return true;
			});
	},
	render: function() {
		const	binding			= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding();

		if(binding.toJS('isSync')) {
			return (
				<div>
					<SubMenu binding = {
						{
							default			: binding.sub('consoleRouting'),
							itemsBinding	: binding.sub('subMenuItems')
						}
					}
					/>
					<div className='bSchoolUnionConsole'>
						<RouterView	routes	= {binding.sub('consoleRouting')}
									binding	= {globalBinding}
						>
							<Route	path		= '/school_union_console /school_union_console/users'
									binding		= {binding.sub('users')}
									component	= {UserListWrapper}
							/>

							<Route	path		= '/school_union_console/requests'
									binding		= {binding.sub('requests')}
									component	= {UserRequestList}
							/>

							<Route	path		= '/school_union_console/archive'
									binding		= {binding.sub('archives')}
									component	= {UserRequestListArchive}
							/>

							<Route	path		= '/school_union_console/sports'
									binding		= {binding.sub('favoriteSports')}
									component	= {FavouriteSportPageWrapper}
							/>

							<Route	path					= "/user/view"
									binding					= {binding.sub('userDetailPage')}
									userPermissionsService	= {window.Server.schoolUserPermissions}
									isEditable				= {false}
									component				= {UserViewComponent}
							/>
						</RouterView>
					</div>
				</div>
			);
		} else {
			return null;
		}
	}
});

module.exports = SchoolUnionConsole;