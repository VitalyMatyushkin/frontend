import {AccountForm} from './payments_account_form';
import {MODE} from './payments_account_form';
import {ServiceList} from "module/core/service_list/service_list";
import * as Morearty from 'morearty';
import * as React from 'react';

export const AddAccount = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.getDefaultBinding().clear();
	},
	submitAdd: function (data) {
		(window.Server as ServiceList).paymentsAccounts.post({schoolId: this.props.schoolId}, data)
		.then(() => {
			document.location.hash = `school_console/accounts`;
		})
		.catch((err) => {
			this.getDefaultBinding().set('errors', err.response.data.details.text);
		});
	},
	render: function () {
		return (
			<AccountForm
				title			= "Add new Account"
				isSchoolConsole	= { true }
				onClickSubmit	= { this.submitAdd }
				binding			= { this.getDefaultBinding() }
				region			= { this.props.region }
				mode			= { MODE.ADD }
				errors			= { this.getDefaultBinding().get('errors') }
			/>
		)
	}
});