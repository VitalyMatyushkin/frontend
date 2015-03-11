LoginUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		window.Server.logout.post().then(function (res) {
			localStorage.clear();
			document.location.hash = 'login';
		});
		return null;
	}
});


module.exports = LoginUserPage;
