import * as  React from 'react';
import * as  Morearty from 'morearty';
import {SVG} from 'module/ui/svg';
import * as RouterView from 'module/core/router';
import * as Route from 'module/core/route';

import {StripeIntegrationsList} from './stripe_integrations_list';
import {AddStripeIntegration} from './form/add_stripe_integration'
import {EditStripeIntegration} from './form/edit_stripe_integration'

export const StripeIntegrations = (React as any).createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const	binding 		= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding(),
				addButton 		= <div className="addButtonShort" onClick={() => document.location.hash += '/add'}><SVG icon="icon_add_news" /></div>;

		return (
			<RouterView
				routes	= { binding.sub('blogsRouting') }
				binding	= { globalBinding }
			>
				<Route
					path		= "/payments/stripe_integrations"
					binding		= { binding.sub('stripeIntegrationsList') }
					component	= { StripeIntegrationsList }
					addButton	= { addButton }
				/>
				<Route
					path		= "/payments/stripe_integrations/add"
					binding		= { binding.sub('stripeIntegrationsForm') }
					component	= { AddStripeIntegration }
				/>
				<Route
					path		= "/payments/stripe_integrations/edit"
					binding		= { binding.sub('stripeIntegrationsForm') }
					component	= { EditStripeIntegration }
				/>
			</RouterView>
		)
	}
});