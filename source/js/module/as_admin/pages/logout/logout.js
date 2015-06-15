LoginUserPage = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var binding = this.getDefaultBinding();
		console.log('called');
		localStorage.clear();
		binding.sub('authorizationInfo').clear();
		document.location.href = '/';

		window.Server.logout.post();
		return null;
	}
});


module.exports = LoginUserPage;
