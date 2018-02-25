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
		const binding = this.getDefaultBinding();
		//Lets clear data in default binding when component is unmounted
		//to make sure some trailing data don't appear when the component is re-mounted subsequently
		binding.clear();
	},
	onSuccess: function(data) {
		window.Server.user.put({userId: data.id}, {
			verified:{
				email:true,
				personal:true,
				phone:true
			}
		}).then( res => {
			document.location.hash = 'users';
			return res;
		});
	},
	render: function() {
		return (
			<div>
				<RegisterForm onSuccess={this.onSuccess} binding={this.getDefaultBinding()} />
			</div>
		)
	}
});


module.exports = RegiseterUserPage;
