import {StripeIntegrationForm} from './stripe_integrations_form';
import {AdminServiceList} from "module/core/service_list/admin_service_list";
import * as Immutable from 'immutable';
import * as Morearty from'morearty';
import * as React from'react';

export const EditStripeIntegration = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				integrationId 	= routingData.id;

		binding.clear();

		if (integrationId) {
			(window.Server as AdminServiceList).paymentsStripeIntegration.get({integrationId}).then( data => {
				binding.set(Immutable.fromJS(data));
			});

			this.integrationId = integrationId;
		}
	},
	submitEdit: function(data) {
		(window.Server as AdminServiceList).paymentsStripeIntegration.put({integrationId: this.integrationId}, data).then(() =>  {
			document.location.hash = 'payments/stripe_integrations';
		});
	},
	render: function() {
		return (
			<StripeIntegrationForm
				title="Edit Stripe integration"
				onClickSubmit={this.submitEdit}
				binding={this.getDefaultBinding()}
			/>
		)
	}
});