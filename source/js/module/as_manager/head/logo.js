const 	React 		= require('react'),
		Morearty	= require('morearty'),
	  	SVG 		= require('module/ui/svg');

const Logo = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		return (
			<div className="bTopLogo">
				<img src="images/logo.png" />
			</div>
		)
	}
});

module.exports = Logo;
