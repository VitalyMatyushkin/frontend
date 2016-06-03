const React = require('react'),
	  SVG = require('module/ui/svg');

const Logo = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		return (
			<div className="bTopLogo">
			<SVG icon="icon_logo" />
			</div>
		)
	}
});

module.exports = Logo;
