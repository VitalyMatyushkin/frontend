var RegisterForm = require('module/pages/register/user/form'),
	RegisterDone = require('module/pages/register/user/done'),
	RegiseterUserPage;

RegiseterUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.Map({
			showForm: true
		});
	},
	onSuccess: function() {
		var self = this;

		self.getDefaultBinding().set('showForm', false);
	},
	onDone: function() {
		var self = this;

		self.getDefaultBinding().set('showForm', true);
	},
	render: function() {
		var self = this,
			currrentView;

		if (self.getDefaultBinding().get('showForm')) {
			currrentView = <RegisterForm onSuccess={self.onSuccess} binding={self.getDefaultBinding()} />
		} else {
			currrentView = <RegisterDone onSingin={self.onDone} />
		}

		return (
			<div>
				{currrentView}
			</div>
		)
	}
});


module.exports = RegiseterUserPage;
