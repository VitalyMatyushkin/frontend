const SVG = require('module/ui/svg'),
	React = require('react');
const AboutMeBlock = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string
	},
	_getAboutNode: function() {
		/**
		 * Arrays holding icon names and data fields, moves away from pushing all of data onto a component array
		 * that was not being cleared and causing page to render details twice
		 */
		var icons = ['icon_home', 'icon_library', 'icon_shot', 'icon_trophy', 'icon_score', 'icon_office'],
			fields = ['houseData.name','classData.name','numOfGamesScoredIn','numOfGamesWon','numberOfGamesPlayed', 'schoolData.name'],
			self = this,
			binding = self.getDefaultBinding();
		return icons.map(function(icon,i){
			let bindingResult = binding.get(fields[i]);
			if (bindingResult||bindingResult === 0) {
				return <div key={i} title={fields[i]} className="eAboutList_item"><SVG icon={icon} /> {bindingResult}</div>
			}
		});
	},
	_getAboutParentNode:function(){
		var icons = ['icon_dad','icon_mom'],
			fields = ['parentOne','parentTwo'],
			self = this,
			binding = self.getDefaultBinding();
		return icons.map(function(icon,i){
			let bindingResult = binding.get(fields[i]);
			if(bindingResult){
				return (
					<div key={i} className="eAboutList_item"><SVG icon={icon} /> {bindingResult}</div>
				)
			}
		});
	},
	render: function() {
		var self = this;
		return (
			<div className="bAboutList">
				<h6>{self.props.title || 'About me'}</h6>
				{self._getAboutNode()}
				<h6>{'Parents'}</h6>
				{self._getAboutParentNode()}
			</div>
		)
	}
});


module.exports = AboutMeBlock;
