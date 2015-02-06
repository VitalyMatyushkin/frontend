var RegisterForm = require('module/pages/register/user/form'),
	RegisterDone = require('module/pages/register/user/done'),
	RegiseterUserPage;

RegiseterUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.Map({
			showForm: false
		});
	},
	onSuccess: function() {
		var self = this;

		self.getDefaultBinding().set('showForm', true);
	},
	onSingin: function() {
		var self = this;

	},
	render: function() {
		var self = this,
			currrentView;

		if (self.getDefaultBinding().get('showForm')) {
			currrentView = <RegisterForm onSuccess={self.onSuccess} binding={self.getDefaultBinding()} />
		} else {
			currrentView = <RegisterDone onSigin={self.onSingin} />
		}

		return (
			<div>
				{currrentView}
			</div>
		)
	}
});


module.exports = RegiseterUserPage;
