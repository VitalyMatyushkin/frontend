import * as React	 from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import * as Loader from 'module/ui/loader';
import {ConsentRequestForm} from './consent_request_form';

import 'styles/pages/b_consent_request_popup.scss';

const STEP = {
	MAIN: 'MAIN',
	MANAGE: 'MANAGE'
};

export const ConsentRequestPopup = (React as any).createClass({
	mixins: [Morearty.Mixin],

	componentWillMount: function () {
		const binding = this.getDefaultBinding();
		binding.set('isSync', false);
		(window as any).Server.consentRequestTemplate.get({schoolId: this.props.schoolId}).then(template => {
			const currentField = template.fields.map(field => {
				field.willBeSent = field.isDefault;
				return field;
			});
			binding.atomically()
				.set('consentFields', Immutable.fromJS(currentField))
				.set('consentStep', STEP.MAIN)
				.set('isDontAskCheckbox', false)
				.set('isSync', true)
			.commit();
		});
	},

	handleCheckBoxClick(e) {
		const binding = this.getDefaultBinding();

		binding.set('isDontAskCheckbox', e.target.checked);
		binding.set('isDisableManage', e.target.checked);
		if (e.target.checked) {
			this.removeAllCheckedField();
		}
		e.stopPropagation();
	},

	removeAllCheckedField: function () {
		const   binding = this.getDefaultBinding();
		let     consentFields = binding.toJS('consentFields');

		consentFields = consentFields.map(field => {
			field.willBeSent = false;
			return field;
		});

		binding.set('consentFields', Immutable.fromJS(consentFields));
	},

	getCountFieldWillBeSent: function () {
		const consentFields = this.getDefaultBinding().toJS('consentFields');
		let countField = 0;
		consentFields.forEach(field => {
			if (field.willBeSent) {
				countField++;
			}
		});

		return countField;
	},

	onCancelForm: function () {
		this.getDefaultBinding().set('consentStep', STEP.MAIN);
	},

	onSubmitForm: function (data) {
		this.getDefaultBinding().set('consentFields', Immutable.fromJS(data));
		this.getDefaultBinding().set('consentStep', STEP.MAIN);
	},

	sendConsentRequest: function () {
		const binding = this.getDefaultBinding();

		binding.set('isSync', false);

		const  currentFields = binding.toJS('consentFields');

		const fields = currentFields.filter( field => field.willBeSent ).map(field => {delete field.willBeSent; return field});

		this.props.sendConsent(fields);
	},

	render() {
		const   binding = this.getDefaultBinding();

		if (binding.get('isSync')) {
			const step = binding.get('consentStep');
			switch (step) {
				case STEP.MAIN:
					const countFieldWillBeSent = this.getCountFieldWillBeSent();
					return (
						<div className="bUniqConsentRequestWrapper">
							<div className="bUniqConsentRequestMain">
								<div className="bUniqConsentRequestMainBody">
									<h2>You are about to send consent requests</h2>
									<div className="bConsentRequestAdditionalInfo">
										{`${countFieldWillBeSent} additional questions will be answered`}
									</div>
									<div className="bConsentRequestDontAskCheckbox">
										<input
											id          = "consent_mode_checkbox"
											className	= "eCheckbox_switch"
											type		= "checkbox"
											onChange	= { (e) => { this.handleCheckBoxClick(e) } }
											checked     = { binding.get('isDontAskCheckbox')}
										/>
										<label/>
										<span>
											Don't ask additional questions with this consent request
										</span>
									</div>
									<button className={`bButton ${binding.get('isDisableManage') ? "mDisable" : ""}`}
									        onClick={() => {binding.set('consentStep', STEP.MANAGE)}}
									>
										Manage questions list
									</button>
								</div>
								<div className="bUniqConsentRequestMainControlButton">
									<button className="bButton mCancel" onClick={() => this.props.handleClickClose()}>Cancel</button>
									<button className="bButton" onClick={() => this.sendConsentRequest()}>Send</button>
								</div>
							</div>
						</div>
					);
				case STEP.MANAGE:
					const consentFields = binding.toJS('consentFields');
					return (
						<div className="bUniqConsentRequestWrapper">
							<ConsentRequestForm
								binding         = { binding.sub('consentForm') }
								consentFields   = { consentFields }
								onCancel        = { this.onCancelForm }
								onSubmit        = { this.onSubmitForm }
							/>
						</div>
					);
			}

		} else {
			return (
				<div className="bUniqConsentRequestWrapper">
					<Loader/>
				</div>
			);
		}
	}
});