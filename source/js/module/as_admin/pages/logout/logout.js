LoginUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var binding = this.getDefaultBinding();

		localStorage.clear();
		binding.sub('authorizationInfo').clear();
		document.location.href = '/';

		window.Server.logout.post();
		return null;
	}
});


module.exports = LoginUserPage;
