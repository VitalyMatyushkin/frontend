var Logo = require('module/main/head/logo'),
	Menu = require('module/main/head/menu'),
	UserBlock = require('module/main/head/user_block'),
	Head;

Head = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this,
			binding = this.getDefaultBinding();

		return (
			<div className="bTopPanel">
				<Logo />
				<Menu binding={binding} />
				<UserBlock binding={binding.sub('userData')} />
			</div>
		)
	}
});

module.exports = Head;
