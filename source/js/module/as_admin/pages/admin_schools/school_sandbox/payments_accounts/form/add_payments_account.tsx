import {AccountForm} from './payments_account_form';
import {AdminServiceList} from "module/core/service_list/admin_service_list";
import * as Loader from 'module/ui/loader';
import * as Morearty from 'morearty';
import * as React from 'react';
import {MODE} from "module/as_manager/pages/school_console/payments_accounts/form/payments_account_form";

export const AddAccount = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const binding = this.getDefaultBinding();
		binding.clear();
		(window.Server as AdminServiceList).paymentsStripeIntegrations.get().then((_stripeIntegrations) => {
			//Making an array for form select from stripe integrations (#payments/stripe_integrations in SA) and putting the option with the default status in the first place
			const stripeIntegrations = _stripeIntegrations.sort((a, b) => {if (b.status === 'DEFAULT') {return 1} if (a.status === 'DEFAULT') {return -1}})
				.map(stripe => {return {value: stripe.id, text: stripe.name}});

			binding.set('stripeIntegrations', stripeIntegrations);
			binding.set('isSyncAddForm', true);
		});
	},
	submitAdd: function (data) {
		const schoolId = this.getMoreartyContext().getBinding().get('routing.pathParameters.0');
		(window.Server as AdminServiceList).paymentsAccounts.post({schoolId}, data).then(() => {
			document.location.hash = `/school_sandbox/${schoolId}/accounts`;
		});
	},
	render: function () {
		if (this.getDefaultBinding().get('isSyncAddForm')) {
			return (
				<AccountForm
					title			= "Add new Account"
					onClickSubmit	= { this.submitAdd }
					binding			= { this.getDefaultBinding() }
					mode			= { MODE.ADD }
				/>
			)
		} else {
			return <Loader/>
		}
	}
});