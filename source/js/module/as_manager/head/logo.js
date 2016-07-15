const 	React 		= require('react'),
		Morearty	= require('morearty'),
	  	SVG 		= require('module/ui/svg');

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
