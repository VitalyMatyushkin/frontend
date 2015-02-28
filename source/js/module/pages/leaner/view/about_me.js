var SVG = require('module/ui/svg'),
	AboutMeBlock;

AboutMeBlock = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string
	},
	_getAboutNode: function(icon, field) {
		var self = this,
			binding = self.getDefaultBinding(),
			bindingResult = binding.get(field);

		if (bindingResult) {
			return <div className="eAboutList_item"><SVG icon={icon} /> {bindingResult}</div>
		}

		return null;
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			aboutListNodes = [];

		aboutListNodes.push(self._getAboutNode('icon_home', 'houseData.name'));
		aboutListNodes.push(self._getAboutNode('icon_user-tie', 'classData.name'));
		aboutListNodes.push(self._getAboutNode('icon_trophy', 'winings'));
		aboutListNodes.push(self._getAboutNode('icon_teams', 'schoolData.name'));


		return (
			<div className="bAboutList">
				<h6>{self.props.title || 'About me'}</h6>

				{aboutListNodes}
			</div>
		)
	}
});


module.exports = AboutMeBlock;
