var SVG = require('module/ui/svg'),
	SchoolInfo;

SchoolInfo = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="bAboutList">
				<h6>Address</h6>

				<div className="eAboutList_item"><SVG icon="icon_home" />51 Shaftesbury Avenue<br/>London W1D 6BA</div>
				<div className="eAboutList_item"><SVG icon="icon_phone" />0844 4825138</div>
			</div>
		)
	}
});

module.exports = SchoolInfo;
