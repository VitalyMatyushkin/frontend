var Logo;
Logo = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this;

		return (
			<div className="bTopLogo">SquadIntouch - Admin Portal</div>
		)
	}
});

module.exports = Logo;
