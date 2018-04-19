import * as  React from 'react';
import * as  Morearty from 'morearty';
import {SVG} from 'module/ui/svg';
import * as RouterView from 'module/core/router';
import * as Route from 'module/core/route';
import * as MoreartyHelper from 'module/helpers/morearty_helper';
import {RegionHelper} from 'module/helpers/region_helper';

import {AccountsList} from './payments_accounts_list';
import {AddAccount} from './form/add_payments_account'
import {EditAccount} from './form/edit_payments_account'

export const PaymentsAccounts = (React as any).createClass({
	mixins: [Morearty.Mixin],
	render: function() {
		const	binding 		= this.getDefaultBinding(),
				globalBinding	= this.getMoreartyContext().getBinding(),
				addButton 		= <div className="addButtonShort" onClick={() => document.location.hash = 'school_console/accounts/add'}><SVG icon="icon_add_news" /></div>,
				schoolId 		= MoreartyHelper.getActiveSchoolId(this),
				region      	= RegionHelper.getRegion(globalBinding);

		return (
			<RouterView
				routes	= { binding.sub('accountsRouting') }
				binding	= { globalBinding }
			>
				<Route
					path		= "/school_console/accounts"
					binding		= { binding.sub('accountsList') }
					component	= { AccountsList }
					addButton	= { addButton }
					schoolId	= { schoolId }
				/>
				<Route
					path		= "/school_console/accounts/add"
					binding		= { binding.sub('accountsForm') }
					component	= { AddAccount }
					schoolId	= { schoolId }
					region		= { region }
				/>
				<Route
					path		= "/school_console/accounts/edit"
					binding		= { binding.sub('accountsForm') }
					component	= { EditAccount }
					schoolId	= { schoolId }
					region		= { region }
				/>
			</RouterView>
		)
	}
});