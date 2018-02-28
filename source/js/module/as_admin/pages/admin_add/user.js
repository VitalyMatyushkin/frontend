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
	render: function() {
		return (
			<div>
				<RegisterForm binding={this.getDefaultBinding()} />
			</div>
		)
	}
});


module.exports = RegiseterUserPage;
