import {AccountForm} from './payments_account_form';
import {AdminServiceList} from "module/core/service_list/admin_service_list";
import * as Morearty from 'morearty';
import * as React from 'react';
import * as Loader from 'module/ui/loader';
import * as Immutable from 'immutable';
import {AccountFormHelper} from 'module/as_admin/pages/admin_schools/school_sandbox/payments_accounts/form/account_form_helper';
import {MODE} from "module/as_manager/pages/school_console/payments_accounts/form/payments_account_form";


export const EditAccount = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				accountId 		= routingData.id;

		this.schoolId = globalBinding.get('routing.pathParameters.0');

		binding.clear();

		if (accountId) {
			(window.Server as AdminServiceList).paymentsAccount.get({schoolId: this.schoolId, accountId}).then( data => {
				binding.set(Immutable.fromJS(AccountFormHelper.dataToClient(data)));

				return (window.Server as AdminServiceList).paymentsStripeIntegrations.get();
			})
			.then((_stripeIntegrations) => {
				//Making an array for form select from stripe integrations (#payments/stripe_integrations in SA) and putting the option with the default status in the first place
				const stripeIntegrations = _stripeIntegrations.sort((a, b) => {if (b.status === 'DEFAULT') {return 1} if (a.status === 'DEFAULT') {return -1}})
					.map(stripe => {return {value: stripe.id, text: stripe.name}});

				binding.set('stripeIntegrations', stripeIntegrations);
				binding.set('isSyncEditForm', true);
			});
			this.accountId = accountId;
		}
	},
	submitEdit: function(data) {
		(window.Server as AdminServiceList).paymentsAccount.put({schoolId: this.schoolId, accountId: this.accountId}, data)
		.then(() =>  {
			document.location.hash = `school_sandbox/${this.schoolId}/accounts`;
		})
		.catch((err) => {
			this.getDefaultBinding().set('errors', err.response.data.details.text);
		});
	},
	render: function() {
		if (this.getDefaultBinding().get('isSyncEditForm')) {
			return (
				<AccountForm
					title			= "Edit Account"
					onClickSubmit	= { this.submitEdit }
					binding			= { this.getDefaultBinding() }
					mode			= { MODE.EDIT }
					errors			= { this.getDefaultBinding().get('errors') }
				/>
			)
		} else {
			return <Loader/>
		}

	}
});