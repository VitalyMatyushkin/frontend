const 	RegisterForm 	= require('module/as_admin/pages/admin_add/user/form'),
		RegisterDone 	= require('module/as_admin/pages/admin_add/user/done'),
		React 			= require('react'),
		Immutable 		= require('immutable');

const RegiseterUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.Map({
			showForm: true
		});
	},
	onSuccess: function(data) {
		var self = this,
			binding = self.getDefaultBinding();
		window.Server.user.put({id:data.id}, {
			verified:{
				email:true,
				personal:true,
				phone:true
			}
		}).then(function(res){
			document.location.hash = 'admin_schools/permissions';
			return res;
		});
	},
	onDone: function() {
		var self = this,
			binding = self.getDefaultBinding();
		//binding.set('showForm', true);
	},
	render: function() {
		var self = this,
			currrentView;
		currrentView = <RegisterForm onSuccess={self.onSuccess} binding={self.getDefaultBinding()} />;
		return (
			<div>
				{currrentView}
			</div>
		)
	}
});


module.exports = RegiseterUserPage;
