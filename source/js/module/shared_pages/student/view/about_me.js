const 	SVG 		= require('module/ui/svg'),
		Morearty	= require('morearty'),
		React 		= require('react');

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
		var icons = ['icon_office', 'icon_home', 'icon_library', 'icon_shot', 'icon_trophy', 'icon_score'],
			fields = ['schoolData.name', 'houseData.name','classData.name','numOfGamesScoredIn','numOfGamesWon','numberOfGamesPlayed'],
			titles = ['School', 'House','Form','Count of games scored in','Count of won games','Count of played games'],
			self = this,
			binding = self.getDefaultBinding();
		return icons.map(function(icon,i){
			let bindingResult = binding.get(fields[i]);
			if (bindingResult||bindingResult === 0) {
				return <div key={i} title={titles[i]} className="eAboutList_item"><SVG icon={icon} /> {bindingResult}</div>
			}
		});
	},
	_getAboutParentNode:function(){
		var self = this,
			binding = self.getDefaultBinding(),
			parents = binding.toJS('parents');
		if(parents !== undefined && parents.length >= 1){
			return parents.map(function(parent, i){
				let icon = parent.gender === 'MALE'?'icon_dad':'icon_mom';
				return(
					<div key={i} className="eAboutList_item"><SVG icon={icon}/>{parent.firstName+' '+parent.lastName}</div>
				)
			});
		}else{
			return (
				<div className="eAboutList_item">{"No parent details found"}</div>
			)
		}
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
