const 	SVG 		= require('module/ui/svg'),
		{DateHelper} 	= require('module/helpers/date_helper'),
		Morearty	= require('morearty'),
		React 		= require('react');

const AboutMeBlock = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: React.PropTypes.string
	},
	_getAboutNode: function() {
		const 	binding 		= this.getDefaultBinding(),
				studentBirthday = DateHelper.toLocal(binding.get('student.birthday'));

		/**
		 * Arrays holding icon names and data fields, moves away from pushing all of data onto a component array
		 * that was not being cleared and causing page to render details twice
		 */
		const icons = ['icon_office', 'icon_home', 'icon_library', 'icon_age', 'icon_shot', 'icon_trophy', 'icon_score'],
			fields = ['schoolData.0.name', 'houseName', 'formName', 'student.age', 'numOfGamesScoredIn','numOfGamesWon','numberOfGamesPlayed'],
			titles = ['School', 'House','Form', `Age. Birthday - ${studentBirthday}`, 'Count of games scored in','Count of won games','Count of played games'];
		return icons.map(function(icon,i){
			let bindingResult = binding.get(fields[i]);
			if (bindingResult||bindingResult === 0) {
				return <div key={i} title={titles[i]} className="eAboutList_item"><SVG icon={icon} /> {bindingResult}</div>
			}
		});
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
				{this.getMedicalInfo()}
			</div>
		)
	}
});


module.exports = AboutMeBlock;
