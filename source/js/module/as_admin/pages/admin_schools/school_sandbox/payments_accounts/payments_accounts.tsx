import * as  React from 'react';
import * as  Morearty from 'morearty';
import {SVG} from 'module/ui/svg';
import * as RouterView from 'module/core/router';
import * as Route from 'module/core/route';

import {AccountsList} from './payments_accounts_list';
import {AddAccount} from './form/add_payments_account'
import {EditAccount} from './form/edit_payments_account'

export const PaymentsAccounts = (React as any).createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const	binding 		= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding(),
				addButton 		= <div className="addButtonShort" onClick={() => document.location.hash += '/add'}><SVG icon="icon_add_news" /></div>;

		return (
			<RouterView
				routes	= { binding.sub('accountsRouting') }
				binding	= { globalBinding }
			>
				<Route
					path		= "/school_sandbox/:schoolId/accounts"
					binding		= { binding.sub('accountsList') }
					component	= { AccountsList }
					addButton	= { addButton }
				/>
				<Route
					path		= "/school_sandbox/:schoolId/accounts/add"
					binding		= { binding.sub('accountsForm') }
					component	= { AddAccount }
				/>
				<Route
					path		= "/school_sandbox/:schoolId/accounts/edit"
					binding		= { binding.sub('accountsForm') }
					component	= { EditAccount }
				/>
			</RouterView>
		)
	}
});