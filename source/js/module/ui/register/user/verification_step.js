var Form = require('module/ui/form/form'),
	FormField = require('module/ui/form/form_field'),
	FormColumn = require('module/ui/form/form_column'),
	PermissionsList = require('module/as_manager/pages/school_admin/permissions/permissions_list'),
	SVG = require('module/ui/svg'),
	If = require('module/ui/if/if'),
	Autocomplete = require('module/ui/autocomplete/autocomplete'),
	VerificationStep;

VerificationStep = React.createClass({
	mixins: [Morearty.Mixin],
	displayName: 'VerificationStep',
	propTypes: {
		onSuccess: React.PropTypes.func
	},
	confirmEmail: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			formFieldsBinding = self.getBinding('formFields');

		Server.confirmUser.get({}, {
			uid: formFieldsBinding.get('id'),
			token: binding.get('emailCode')
		}).then(function() {
			formFieldsBinding.set('verified.email', true);
		});
	},
	confirmPhone: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			formFieldsBinding = self.getBinding('formFields');

		Server.confirmUser.get({}, {
			uid: formFieldsBinding.get('id'),
			token: binding.get('phoneCode')
		}).then(function() {
			formFieldsBinding.set('verified.phone', true);
		});
	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className="eRegistration_verification">
				<label className="eRegistration_label">
					<span className="eRegistration_labelField">Verification email</span>
					<Morearty.DOM.input className='eRegistration_input'
						ref='emailCodeField'
						value={ binding.get('emailCode') }
						placeholder="email code"
						onChange={ Morearty.Callback.set(binding, 'emailCode') } />
					<button className="bButton" onClick={self.confirmEmail}>check</button>
				</label>
				<label className="eRegistration_label">
					<span className="eRegistration_labelField">Verification phone</span>
					<Morearty.DOM.input className='eRegistration_input'
						ref='phoneCodeField'
						value={ binding.get('phoneCode') }
						placeholder="phone code"
						onChange={ Morearty.Callback.set(binding, 'phoneCode') } />
					<button className="bButton" onClick={self.confirmPhone}>check</button>
				</label>
			</div>
		);
	}
});


module.exports = VerificationStep;
