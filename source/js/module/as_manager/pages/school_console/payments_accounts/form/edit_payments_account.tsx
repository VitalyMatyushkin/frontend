import {AccountForm} from './payments_account_form';
import {ServiceList} from "module/core/service_list/service_list";
import * as Morearty from 'morearty';
import * as React from 'react';
import * as Loader from 'module/ui/loader';
import * as Immutable from 'immutable';
import {AccountFormHelper} from 'module/as_admin/pages/admin_schools/school_sandbox/payments_accounts/form/account_form_helper';
import {MODE} from "module/as_manager/pages/school_console/payments_accounts/form/payments_account_form";
import * as BPromise  from  'bluebird';

export const EditAccount = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				accountId 		= routingData.id;


		binding.clear();

		if (accountId) {
			(window.Server as ServiceList).paymentsAccount.get({schoolId: this.props.schoolId, accountId}).then( data => {
				binding.set(Immutable.fromJS(AccountFormHelper.dataToClient(data)));
				binding.set('isSyncEditForm', true);
			});
			this.accountId = accountId;
		}
	},
	submitEdit: function(data) {
		const 	submitFormPromise = (window.Server as ServiceList).paymentsAccount.put({schoolId: this.props.schoolId, accountId: this.accountId}, data),
				acceptTOSPromise = data.tosAcceptanceAgreement ? (window.Server as ServiceList).tosAcceptance.put({schoolId: this.props.schoolId, accountId: this.accountId}) :
					BPromise.resolve(true);

		BPromise.all([
			submitFormPromise,
			acceptTOSPromise
		])
		.then(() =>  {
			document.location.hash = `school_console/accounts`;
		})
	},
	render: function() {
		if (this.getDefaultBinding().get('isSyncEditForm')) {
			return (
				<AccountForm
					title			= "Edit Account"
					onClickSubmit	= { this.submitEdit }
					binding			= { this.getDefaultBinding() }
					region			= { this.props.region }
					mode			= { MODE.EDIT }
				/>
			)
		} else {
			return <Loader/>
		}

	}
});