LoginUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		window.Server.logout.post().then(function (res) {
			localStorage.clear();
			document.location.href = '/#login';
		});
		return null;
	}
});


module.exports = LoginUserPage;
