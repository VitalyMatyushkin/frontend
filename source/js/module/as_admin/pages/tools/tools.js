/**
 * Created by Woland on 02.08.2017.
 */
const 	React 		= require('react'),
		Morearty	= require('morearty'),
		Immutable 	= require('immutable');

const 	RouterView 	= require('module/core/router'),
		Route 		= require('module/core/route'),
		{SubMenu} 	= require('module/ui/menu/sub_menu');

const 	AddInviteComponent 		= require('./add_invite'),
		ListInviteComponent 	= require('./list_invite');

const Tools = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function(){
		const 	binding 	= this.getDefaultBinding(),
				menuItems 	= 	[
								{
									href:'/#tools/import_students',
									name: '← Back',
									key:'back'
								},
								{
									href:'/#school-invite/add-invite',
									name: 'Add invite',
									key:'add invite'
								},
								{
									href:'/#school-invite/list-invite',
									name: 'List invite',
									key:'list invite'
								}
							];
		
		//Set sub menu items in default binding
		binding.set('subMenuItems', Immutable.fromJS(menuItems));
	},
	
	render:function(){
		const 	binding 	= this.getDefaultBinding(),
				subBinding 	= binding.sub('invitesRouting'),
				global 		= this.getMoreartyContext().getBinding();

		return (
			<div>
				<SubMenu binding={{default: subBinding.sub('routing'), itemsBinding: binding.sub('subMenuItems')}} />
				{/*Display current school name, so admin knows what school he or she is operating on*/}
				<div className="bSchoolMaster">
					<RouterView routes={subBinding.sub('routing')} binding={global}>
						<Route
							path 		="/school-invite/add-invite"
							binding 	={ subBinding }
							component 	={ AddInviteComponent }
						/>
						<Route
							path 		="/school-invite/list-invite"
							binding 	= { subBinding }
							component 	= { ListInviteComponent }
						/>
					</RouterView>
				</div>
			</div>
		)
	}
});

module.exports = Tools;