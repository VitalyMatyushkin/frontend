LoginUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var binding = this.getDefaultBinding();

		//window.Server.logout.post();
		Helpers.cookie.remove('authorizationInfo');
		binding.sub('authorizationInfo').clear();
		document.location.hash = '#login';

		return null;
	}
});

module.exports = LoginUserPage;