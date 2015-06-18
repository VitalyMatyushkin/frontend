var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	ChooseRegisterTypeForm;

ChooseRegisterTypeForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSuccess: React.PropTypes.func
	},
	getClickFunction: function(registerType) {
		var self = this;

		return function() {
			self.getDefaultBinding().set('registerType', registerType);
			self.props.onSuccess();
		}
	},
	render: function() {
		var self = this;

		return (
			<div className="bForm mRegisterSteps">
				<div className="eForm_atCenter">
					<h2>Joins us...</h2>

					<div className="eForm_field">
<<<<<<< HEAD:source/js/module/ui/register/user/form_step.js
						<div className="eForm_fieldSelection"><div className="bButton" onClick={self.setStepParent}>as parent</div></div>
						<div className="eForm_fieldMicroHelp">I’m a parent and my child(ren) is a student of a school registered in SquadInTouch</div>
					</div>

					<div className="eForm_field">
						<div className="eForm_fieldSelection"><div className="bButton" onClick={self.setStepCoach}>as coach</div></div>
						<div className="eForm_fieldMicroHelp">I’m a coach and I coach a team of a school registered in SquadInTouch</div>
					</div>

					<div className="eForm_field">
						<div className="eForm_fieldSelection"><div className="bButton" onClick={self.setStepOfficial}>as official</div></div>
						<div className="eForm_fieldMicroHelp">I’m school an official willing to register my school in SquadInTouch</div>
=======
						<div className="eForm_fieldSelection"><div className="bButton" onClick={self.getClickFunction('parent')}>as parent</div></div>
						<div className="eForm_fieldMicroHelp">I’m a parent and my children is a students of a school registered in SquadInTouch</div>
					</div>

					<div className="eForm_field">
						<div className="eForm_fieldSelection"><div className="bButton" onClick={self.getClickFunction('coach')}>as coach</div></div>
						<div className="eForm_fieldMicroHelp">I’m a coacher and I coach a team of a school registered in SquadInTouch</div>
					</div>

					<div className="eForm_field">
						<div className="eForm_fieldSelection"><div className="bButton" onClick={self.getClickFunction('official')}>as official</div></div>
						<div className="eForm_fieldMicroHelp">I’m school officials willing to register my school in SquadInTouch</div>
>>>>>>> feature/69_1_feature:source/js/module/ui/register/user/choose_type.js
					</div>
				</div>
			</div>
		)
	}
});


module.exports = ChooseRegisterTypeForm;
