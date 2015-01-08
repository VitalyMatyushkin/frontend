var Center;

Center = React.createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		var self = this;

		return (
			<div className="bMainLayout mClearFix">
				<div className="bPageWrap">
				hello world
				</div>
			</div>
		)
	}
});

module.exports = Center;
