var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	React = require('react'),
	ReactDOM = require('reactDom'),
	ChoosePermissionType;

ChoosePermissionType = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSuccess: React.PropTypes.func
	},
	getClickFunction: function(permissionType) {
		var self = this;

		return function() {

			self.getDefaultBinding().set('permissionType', permissionType);
			self.props.onSuccess();
		}
	},
	render: function() {
		var self = this;

		return (
			<div className="bForm mRegisterSteps">
				<div className="eForm_atCenter">
					<h2>Choose permissions type...</h2>

					<div className="eForm_field">
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
					</div>
				</div>
			</div>
		)
	}
});


module.exports = ChoosePermissionType;
