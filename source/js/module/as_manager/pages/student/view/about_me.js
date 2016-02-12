const SVG = require('module/ui/svg'),
	React = require('react');
var	aboutListNodes = [],
	parentListNodes = [];
const AboutMeBlock = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string
	},
	_getAboutNode: function(icon, field) {
		var self = this,
			binding = self.getDefaultBinding(),
			bindingResult = binding.get(field);
		if (bindingResult||bindingResult === 0) {
			return <div key={aboutListNodes.length} title={field} className="eAboutList_item"><SVG icon={icon} /> {bindingResult}</div>
		}
		return null;
	},
	_getAboutParentNode:function(icon,parentDetails){
		var self = this,
			binding = self.getDefaultBinding(),
			bindingResult = binding.get(parentDetails);
		if(bindingResult){
			return (
				<div key={parentListNodes.length} className="eAboutList_item"><SVG icon={icon} /> {bindingResult}</div>
			)
		}
		return null;
	},
	componentWillUnmount:function(){
		//Clear the arrays used
		aboutListNodes.length = 0;
		parentListNodes.length = 0;
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();
		aboutListNodes.push(self._getAboutNode('icon_home', 'houseData.name'));
		aboutListNodes.push(self._getAboutNode('icon_library', 'classData.name'));
		aboutListNodes.push(self._getAboutNode('icon_shot','numOfGamesScoredIn'));
		aboutListNodes.push(self._getAboutNode('icon_trophy', 'numOfGamesWon'));
		aboutListNodes.push(self._getAboutNode('icon_score','numberOfGamesPlayed'));
		aboutListNodes.push(self._getAboutNode('icon_office', 'schoolData.name'));
		parentListNodes.push(self._getAboutParentNode('icon_dad','parents.0.firstName'));
		parentListNodes.push(self._getAboutParentNode('icon_mom','parents.1.firstName'));
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
