/**
 * Created by Vitaly on 09.08.17.
 */
const	React									= require('react'),
		Morearty								= require('morearty'),
		Immutable								= require('immutable'),
		RouterView								= require('module/core/router'),
		Route									= require('module/core/route'),
		SubMenu									= require('module/ui/menu/sub_menu'),
		SVG										= require('module/ui/svg');

const 	AdminListComponent						= require('module/as_admin/pages/admin_schools/admin_views/admin_schools_list'),
		SchoolUnionListWrapper					= require('./school_union_list/school_union_list_wrapper'),
		SchoolUnionEdit							= require('./school_union_list/school_union_edit/school_union_edit'),
		SchoolUnionCreate						= require('./school_union_list/school_union_add/school_union_add'),
		AdminAddComponent						= require('module/as_admin/pages/admin_schools/admin_views/admin_add'),
		AdminEditComponent						= require('module/as_admin/pages/admin_schools/admin_views/admin_edit');

const OneSchoolPage = React.createClass({
	mixins: [Morearty.Mixin],
	createNewSchool: function() {
		document.location.hash = 'schools/admin_views/add';
	},
	//The function, which will call when user click on <Row> in Grid
	getViewFunction: function(itemId){
		document.location.hash = `school_sandbox/${itemId}/forms`;
	},
	componentWillMount: function() {
		this.createSubMenu();
	},
	componentDidMount: function() {
		const globalBinding = this.getMoreartyContext().getBinding();

		this.addBindingListener(globalBinding, 'submenuNeedsUpdate', this.createSubMenu);
	},
	getDefaultState: function() {
		return Immutable.fromJS({
			admin_views: {
				schools: [],
				schoolDetailPage: {},
				editSchoolPage: {},
				userList: {},
				parentPermission: {}
			},
			schoolInfo: '',
			schoolRouting: {},
			sports: {},
			schoolUnions: {},
			schoolUnionView: {},
			schoolUnionEdit: {},
			schoolUnionCreate: {form: {}}
		});
	},
	createSubMenu: function(){
		const	self	= this,
			binding	= self.getDefaultBinding();

		const _createSubMenuData = function(){
			let menuItems = [
				{
					href: '/#schools/admin_views/list',
					name: 'Schools',
					key: 'schools'
				},{
					href: '/#schools/school_unions',
					name: 'School Unions',
					key: 'school_unions'
				}
			];
			binding.atomically().set('subMenuItems', Immutable.fromJS(menuItems)).commit();
		};

		_createSubMenuData('*');	// drawing placeholder

		//Get the total number of permissions (Notification badge) in submenu
		// TODO shitty way
		// server doesn't implement filters
		// so we should filter and count permissions by our hands
		return window.Server.permissionRequests.get({
			filter: {
				limit: 1000 //TODO: holy crap
			}
		})
			.then(permissions => permissions.filter(permission => permission.status === "NEW"))
			.then(permissions => {
				_createSubMenuData(permissions.length);
				// yep, always i'm right
				return true;
			});
	},
	render: function() {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				addButton 		= <div className="addButtonShort" onClick={this.createNewSchool}><SVG icon="icon_add_school" /></div>;

		return (
			<div>
				<SubMenu binding={{default: binding.sub('schoolRouting'), itemsBinding: binding.sub('subMenuItems')}} />
				<div className="bSchoolMaster">
					<RouterView routes={binding.sub('schoolRouting')} binding={globalBinding}>
						<Route
							path 				= "/schools /schools/admin_views/list /schools/admin_views/list:mode"
							binding 			= { binding.sub('schools') }
							component 			= { AdminListComponent }
							addButton 			= { addButton }
							handleClick 		= { this.getViewFunction }
						/>
						<Route
							path 				= "/schools/school_unions"
							binding 			= { binding.sub('schoolUnions') }
							component 			= { SchoolUnionListWrapper }
						/>
						<Route
							path 				= "/schools/school_unions/add"
							binding 			= { binding.sub('schoolUnionCreate') }
							component 			= { SchoolUnionCreate }
						/>
						<Route
							path 				= "/schools/school_union /schools/school_union/:schoolId"
							binding 			= { binding.sub('schoolUnionEdit') }
							component 			= { SchoolUnionEdit }
						/>
						<Route
							path 				= "/schools/admin_views/add /schools/admin_views/add:mode"
							binding 			= { binding.sub('addSchoolPage') }
							component 			= { AdminAddComponent }
						/>
						<Route
							path 				= "/schools/admin_views/edit /schools/admin_views/edit:mode"
							binding 			= { binding.sub('editSchoolPage') }
							component 			= { AdminEditComponent }
						/>
					</RouterView>
				</div>
			</div>
		)
	}
});

module.exports = OneSchoolPage;
