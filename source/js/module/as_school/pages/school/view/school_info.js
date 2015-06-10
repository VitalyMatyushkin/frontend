var SVG = require('module/ui/svg'),
	If = require('module/ui/if/if'),
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

				<div className="eAboutList_item"><SVG icon="icon_home" />{binding.get('address')}</div>
				<If condition={binding.get('phone')}>
					<div className="eAboutList_item"><SVG icon="icon_phone" />{binding.get('phone')}</div>
				</If>
			</div>
		)
	}
});

//<div className="eAboutList_item"><SVG icon="icon_phone" />0844 4825138</div>
module.exports = SchoolInfo;
