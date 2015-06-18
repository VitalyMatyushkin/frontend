var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	RegiseterUserForm;

RegiseterUserForm = React.createClass({
	mixins: [Morearty.Mixin],
	setStepParent: function() {
		var self = this;

		self.getDefaultBinding().set('step', 'as_parent');
	},
	setStepCoach: function() {
		var self = this;

		self.getDefaultBinding().set('step', 'as_coach');
	},
	setStepOfficial: function() {
		var self = this;

		self.getDefaultBinding().set('step', 'as_official');
	},
	render: function() {
		var self = this;

		return (
			<div className="bForm mRegisterSteps">
				<div className="eForm_atCenter">
					<h2>Joins us...</h2>

					<div className="eForm_field">
						<div className="eForm_fieldSelection"><div className="bButton" onClick={self.setStepParent}>as parent</div></div>
						<div className="eForm_fieldMicroHelp">I’m a parent and my children is a students of a school registered in SquadInTouch</div>
					</div>

					<div className="eForm_field">
						<div className="eForm_fieldSelection"><div className="bButton" onClick={self.setStepCoach}>as coach</div></div>
						<div className="eForm_fieldMicroHelp">I’m a coacher and I coach a team of a school registered in SquadInTouch</div>
					</div>

					<div className="eForm_field">
						<div className="eForm_fieldSelection"><div className="bButton" onClick={self.setStepOfficial}>as official</div></div>
						<div className="eForm_fieldMicroHelp">I’m school officials willing to register my school in SquadInTouch</div>
					</div>
				</div>
			</div>
		)
	}
});


module.exports = RegiseterUserForm;
