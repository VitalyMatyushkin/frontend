import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';

import * as RouterView from 'module/core/router';
import * as Route from 'module/core/route';
import {SubMenu} from 'module/ui/menu/sub_menu';

import {StripeIntegrations} from './stripe_integrations/stripe_integrations';

export const PaymentsComponent = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function(){
		this.createSubMenu();
	},
	componentDidMount: function() {
		const globalBinding = this.getMoreartyContext().getBinding();

		this.addBindingListener(globalBinding, 'submenuNeedsUpdate', this.createSubMenu);
	},
	createSubMenu: function(){
		const binding = this.getDefaultBinding();

		const menuItems = [
			{
				href:'/#payments/stripe_integrations',
				name:'Stripe Integrations',
				key:'stripe_integrations'
			}
		];
		binding.atomically().set('subMenuItems', Immutable.fromJS(menuItems)).commit();
	},
	render:function(){
		const 	binding 	= this.getDefaultBinding(),
				global 		= this.getMoreartyContext().getBinding();

		return (
			<div>
				<SubMenu binding={{default: binding.sub('payments Routing'), itemsBinding: binding.sub('subMenuItems')}} />
				<div className="bSchoolMaster">
					<RouterView routes={binding.sub('paymentsRouting')} binding={global}>
						<Route
							path 		= "/payments /payments/stripe_integrations"
							binding 	= { binding.sub('stripe_integrations') }
							component 	= { StripeIntegrations }
						/>
					</RouterView>
				</div>
			</div>
		)
	}
});