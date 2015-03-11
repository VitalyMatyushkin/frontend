LoginUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var binding = this.getDefaultBinding();

		window.Server.logout.post().then(function (res) {
			binding.sub('authorizationInfo').clear();
			localStorage.clear();
			document.location.href = '/#login';
		});
		return null;
	}
});


module.exports = LoginUserPage;
