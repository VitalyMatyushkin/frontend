/**
 * Created by vitaly on 12.09.17.
 */

const	React 					= require('react'),
		Morearty				= require('morearty'),
		RouterView 				= require('module/core/router'),
		Route 					= require('module/core/route'),
		PostcodesListComponent	= require('module/as_admin/pages/admin_schools/postcodes/postcodes-list'),
		PostcodesAddComponent	= require('module/as_admin/pages/admin_schools/postcodes/postcode_add'),
		PostcodesEditComponent	= require('module/as_admin/pages/admin_schools/postcodes/postcode_edit'),
		SVG						= require('module/ui/svg');

const PostcodesPage = React.createClass({
	mixins: [Morearty.Mixin],
	createNewClass: function(){
		document.location.hash = document.location.hash +'/add';
	},
	render: function() {
		const 	binding 		= this.getDefaultBinding(),
				subBinding 		= binding.sub('postcodesRouting'),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				addButton 		= <div className="addButtonShort" onClick={this.createNewClass}><SVG icon="icon_add_school" /></div>;


		return (
			<RouterView routes={ subBinding.sub('routing') } binding={globalBinding}>
				<Route path="/tools/postcodes" binding={subBinding.sub('postcodesList')} component={PostcodesListComponent} addButton={addButton}/>
				<Route path="/tools/postcodes/add"  binding={subBinding} component={PostcodesAddComponent}  />
				<Route path="/tools/postcodes/edit/:postcodeId" binding={subBinding} component={PostcodesEditComponent}  />

			</RouterView>
		)
	}
});


module.exports = PostcodesPage;
