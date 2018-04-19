import * as React from 'react';
import * as Morearty from 'morearty';
import * as Form from 'module/ui/form/form';
import * as FormColumn from 'module/ui/form/form_column';
import * as FormBlock from 'module/ui/form/form_block/form_block';
import * as FormField from 'module/ui/form/form_field';
import {STATUS} from 'module/as_admin/pages/admin_schools/school_sandbox/payments_accounts/form/status_helper';
import {AccountFormHelper} from 'module/as_admin/pages/admin_schools/school_sandbox/payments_accounts/form/account_form_helper';
import {DEFAULT_SELECT_DATA} from 'module/as_admin/pages/admin_schools/school_sandbox/payments_accounts/form/account_form_helper';

import 'styles/pages/schools/b_payments_accounts.scss';

export const MODE = {
	ADD: 'ADD',
	EDIT: 'EDIT'
};

export const AccountForm = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title: (React as any).PropTypes.string.isRequired,
		onClickSubmit: (React as any).PropTypes.func.isRequired,
		region: (React as any).PropTypes.string,
		mode: (React as any).PropTypes.string
	},

	onSubmit: function(data) {
		if (this.props.mode === MODE.ADD) {
			delete data.stripeData.tosAcceptance;
		}
		delete data.agreement;
		this.props.onClickSubmit(AccountFormHelper.dataToServer(data,  this.props.region));
	},

	renderAccountMainDataBlock: function() {
		const binding = this.getDefaultBinding();

		return (
			<FormBlock
				isShowCloseButton	= { false }
			>
				<h3>Account main data</h3>
				<FormField
					type 		= "text"
					field 		= "name"
				>
					Name
				</FormField>
				<FormField
					type    		= "dropdown"
					field   		= "status"
					options 		= { STATUS }
					defaultValue	= { !binding.toJS('status') ? DEFAULT_SELECT_DATA.STATUS : undefined }
				>
					Status
				</FormField>
				<FormField
					field			= 'stripeData.country'
					type 			= "dropdown"
					options			= { AccountFormHelper.getCountries() }
					defaultValue	= { !binding.toJS('stripeData.country') ? DEFAULT_SELECT_DATA.COUNTRY : undefined }
					isDisabled		= { this.props.mode === MODE.EDIT }
				>
					Country
				</FormField>
				<FormField
					type		= "text"
					field		= "stripeData.email"
					validation	= "email required"
				>
					Email
				</FormField>
				<FormField
					type 		= "text"
					field 		= "stripeData.businessName"
					validation  = "required"
				>
					Business name
				</FormField>
			</FormBlock>
		);
	},

	renderExternalAccountDataBlock: function() {
		const binding = this.getDefaultBinding();

		return (
			<FormBlock
				isShowCloseButton={false}
			>
				<h3>External account data</h3>
				<FormField
					field='stripeData.externalAccount.accountNumber'
					type="text"
					validation="required"
				>
					Account number
				</FormField>
				<FormField
					field			= 'stripeData.externalAccount.country'
					type 			= "dropdown"
					options			= { AccountFormHelper.getCountries() }
					defaultValue	= { !binding.toJS('stripeData.externalAccount.country') ? DEFAULT_SELECT_DATA.COUNTRY : undefined }
				>
					Country
				</FormField>
				<FormField
					field			= 'stripeData.externalAccount.currency'
					type 			= "dropdown"
					options			= { AccountFormHelper.getCurrency() }
					defaultValue	= { !binding.toJS('stripeData.externalAccount.currency') ? DEFAULT_SELECT_DATA.CURRENCY : undefined }
				>
					Currency
				</FormField>
				<FormField
					field='stripeData.externalAccount.accountHolderName'
					type="text"
				>
					Account holder name
				</FormField>
				<FormField
					field			= 'stripeData.externalAccount.accountHolderType'
					type			= 'dropdown'
					options			= { AccountFormHelper.getTypes() }
					defaultValue	= { !binding.toJS('stripeData.externalAccount.accountHolderType') ? DEFAULT_SELECT_DATA.ACCOUNT_HOLDER_TYPE : undefined }
				>
					Account holder type
				</FormField>
				<FormField
					field	='stripeData.externalAccount.routingNumber'
					type	="text"
				>
					Routing number
				</FormField>
			</FormBlock>
		);
	},

	renderLegalEntityDataBlock: function() {
		const binding = this.getDefaultBinding();

		return (
			<FormBlock
				isShowCloseButton={false}
			>
				<h3>Legal entity data</h3>
				<FormField
					field		= 'stripeData.legalEntity.dob'
					type		= "date"
					validation  = "date required"
					region		= { this.props.region }
				>
					DOB
				</FormField>
				<FormField
					field	= 'stripeData.legalEntity.firstName'
					type	= "text"
				>
					First name
				</FormField>
				<FormField
					field	= 'stripeData.legalEntity.lastName'
					type	= "text"
				>
					Last name
				</FormField>
				<FormField
					field 			= 'stripeData.legalEntity.type'
					type			= 'dropdown'
					options			= { AccountFormHelper.getTypes() }
					defaultValue	= { !binding.toJS('stripeData.legalEntity.type') ? DEFAULT_SELECT_DATA.LEGAL_ENTITY_TYPE : undefined }
				>
					Type
				</FormField>
			</FormBlock>
		);
	},

	renderTosAcceptanceDataBlock: function() {
		return (
			<FormBlock
				isShowCloseButton	= {false}
				customStyle			= 'mDisable'
			>
				<h3>Tos acceptance data</h3>
				<FormField
					field		= 'stripeData.tosAcceptance.date'
					type		= "date"
					validation  = "date required"
					region		= { this.props.region }
				>
					Date
				</FormField>
				<FormField
					field		= 'stripeData.tosAcceptance.ip'
					type		= "text"
					validation  = "ip required"
				>
					IP
				</FormField>
				<FormField
					field		= 'stripeData.tosAcceptance.userAgent'
					type		= "text"
					validation  = "required"
				>
					User agent
				</FormField>
			</FormBlock>
		);
	},

	renderAccountAgreementBlock: function() {
		return (
			<FormBlock
				isShowCloseButton	= {false}
				isVisible			= {this.props.isSchoolConsole}
			>
				<div className="eAgreementText ">
					By registering your account, you agree the <a className="eAgreementLink" target="_blank" href="https://stripe.com/us/connect-account/legal">Stripe Connected Account Agreement</a>
				</div>
				<FormField
					classNames 	= "mSingleLine"
					type 		= "checkbox"
					field 		= "agreement"
				>
					I agree to terms
				</FormField>
			</FormBlock>
		);
	},

	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<Form
				name		    = { this.props.title }
				binding         = { binding }
				onSubmit        = { this.onSubmit }
				formStyleClass	= "bPaymentsAccountForm"
				formButtonsClass= {`col-md-5 col-md-offset-2 ${!binding.meta().toJS("agreement.value") ? 'mDisableButton' : ''}`}
			>
				<FormColumn
					key			= 'left_column'
					customStyle	= 'col-md-5'
				>
					{this.renderAccountMainDataBlock()}
					{this.renderExternalAccountDataBlock()}
				</FormColumn>
				<FormColumn
					key			= 'right_column'
					customStyle	= 'col-md-5 col-md-offset-2'
				>
					{this.renderLegalEntityDataBlock()}
					{this.props.mode === MODE.EDIT ? this.renderTosAcceptanceDataBlock() : <div></div>}
					{this.renderAccountAgreementBlock()}
				</FormColumn>
			</Form>
		);

	}
});