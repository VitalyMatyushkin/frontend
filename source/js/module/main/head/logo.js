var Logo;

Logo = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this;

		return (
			<div className="bTopLogo">Squard in touch</div>
		)
	}
});

module.exports = Logo;
