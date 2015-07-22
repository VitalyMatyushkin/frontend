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
	_getAboutParentNode:function(icon,parentDetails){
		var self = this,
			binding = self.getDefaultBinding(),
			bindingResult = binding.get(parentDetails);
		if(bindingResult){
			return (
				<div className="eAboutList_item"><SVG icon={icon} /> {bindingResult}</div>
			)
		}
		return null;
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			aboutListNodes = [],
			parentListNodes = [];
		aboutListNodes.push(self._getAboutNode('icon_home', 'house.name'));
		aboutListNodes.push(self._getAboutNode('icon_user-tie', 'form.name'));
		aboutListNodes.push(self._getAboutNode('icon_shot','numOfGamesScoredIn'));
		aboutListNodes.push(self._getAboutNode('icon_trophy', 'numOfGamesWon'));
		aboutListNodes.push(self._getAboutNode('icon_user','numberOfGamesPlayed'));
		aboutListNodes.push(self._getAboutNode('icon_teams', 'school.name'));
		parentListNodes.push(self._getAboutParentNode('icon_user-tie','parents.0.firstName'));
		parentListNodes.push(self._getAboutParentNode('icon_user','parents.1.firstName'));
		return (
			<div className="bAboutList">
				<h6>{self.props.title || 'About me'}</h6>
				{aboutListNodes}
				<h6>{'Parents'}</h6>
				{parentListNodes}
			</div>
		)
	}
});


module.exports = AboutMeBlock;
