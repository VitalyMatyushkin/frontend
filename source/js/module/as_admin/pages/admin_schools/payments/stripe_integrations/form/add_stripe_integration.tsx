import {StripeIntegrationForm} from './stripe_integrations_form';
import {AdminServiceList} from "module/core/service_list/admin_service_list";
import * as Morearty from 'morearty';
import * as React from 'react';

export const AddStripeIntegration = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.getDefaultBinding().clear();
	},
	submitAdd: function (data) {
		(window.Server as AdminServiceList).paymentsStripeIntegrations.post(data).then(() => {
			document.location.hash = 'payments/stripe_integrations';
		});
	},
	render: function () {
		return (
			<StripeIntegrationForm
				title="Add new Stripe integration"
				onClickSubmit={this.submitAdd}
				binding={this.getDefaultBinding()}
			/>
		)
	}
});