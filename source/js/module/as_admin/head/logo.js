var Logo;
Logo = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this;

		return (
			<div className="bTopLogo">SquadInTouch - Admin Portal</div>
		)
	}
});

module.exports = Logo;
