const 	RegisterForm 	= require('module/as_admin/pages/admin_add/user/form'),
		React 			= require('react'),
		Morearty    	= require('morearty'),
		Immutable 		= require('immutable');

const RegiseterUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.Map({
			showForm: true
		});
	},
	componentWillUnmount:function(){
		var self = this,
			binding = self.getDefaultBinding();
		//Lets clear data in default binding when component is unmounted
		//to make sure some trailing data don't appear when the component is re-mounted subsequently
		binding.clear();
	},
	onSuccess: function(data) {
		var self = this,
			binding = self.getDefaultBinding();
		window.Server.user.put({userId:data.id}, {
			verified:{
				email:true,
				personal:true,
				phone:true
			}
		}).then(function(res){
			document.location.hash = 'users';
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
			currentView = <RegisterForm onSuccess={self.onSuccess} binding={self.getDefaultBinding()} />;
		return (
			<div>
				{currentView}
			</div>
		)
	}
});


module.exports = RegiseterUserPage;
