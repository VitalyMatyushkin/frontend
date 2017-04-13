const 	SVG 		= require('module/ui/svg'),
		DateHelper 	= require('module/helpers/date_helper'),
		Morearty	= require('morearty'),
		React 		= require('react');

const AboutMeBlock = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string
	},
	_getAboutNode: function() {
		const 	binding 				= this.getDefaultBinding(),
				studentBirthday 		= DateHelper.toLocal(binding.get('student.birthday')),
				studentBirthdayArray 	= studentBirthday.split('.');
		/**
		 * Arrays holding icon names and data fields, moves away from pushing all of data onto a component array
		 * that was not being cleared and causing page to render details twice
		 */
		const icons = ['icon_office', 'icon_home', 'icon_library', 'icon_age', 'icon_shot', 'icon_trophy', 'icon_score'],
			fields = ['schoolData.name', 'houseData.name', 'classData.name', 'student.age', 'numOfGamesScoredIn','numOfGamesWon','numberOfGamesPlayed'],
			titles = ['School', 'House','Form', `Age. Date of birth: - ${studentBirthdayArray[0]}/${studentBirthdayArray[1]}/${studentBirthdayArray[2]}`, 'Number of games scored in','Number of games won','Number of games played'];
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
	getMedicalInfo: function () {
		const 	binding = this.getDefaultBinding(),
				medicalInfo = binding.toJS('student.medicalInfo');

		return medicalInfo && (
			<div>
				<h6>Medical Information</h6>
				<div className="eAboutList_item mMedical">{medicalInfo}</div>
			</div>
			);
	},
	render: function() {
		return (
			<div className="bAboutList">
				<h6>{this.props.title || 'About me'}</h6>
				{this._getAboutNode()}
				<h6>Parents</h6>
				{this._getAboutParentNode()}
				{this.getMedicalInfo()}
			</div>
		)
	}
});


module.exports = AboutMeBlock;
