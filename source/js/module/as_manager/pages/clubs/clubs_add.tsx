import * as React from 'react'
import * as Morearty from 'morearty'

import * as ClubForm from 'module/as_manager/pages/clubs/clubs_form/clubs_form'
import * as ClubsHelper from 'module/as_manager/pages/clubs/clubs_helper'
import {ServiceList} from "module/core/service_list/service_list";
import {ClubFormData} from "module/as_manager/pages/clubs/clubs_form/models/club_form_data";

export const ClubsAdd = (React as any).createClass({
	mixins: [Morearty.Mixin],

	componentWillMount() {
		this.getDefaultBinding().sub('clubsForm').clear();
	},
	submitAdd(data: ClubFormData) {
		const binding = this.getDefaultBinding();
		const formDataDays = typeof this.getDefaultBinding().toJS('clubsForm.days') !== 'undefined' ?
			this.getDefaultBinding().toJS('clubsForm.days') : [];

		//week days is required
		if (formDataDays.length === 0) {
			binding.set('clubsForm.isRequiredErrorDays', true);
		} else {
			const serverFormData = ClubsHelper.convertClientToServerFormData(
				data,
				this.getDefaultBinding().toJS('clubsForm')
			);

			(window.Server as ServiceList).schoolClubs.post(
				this.props.activeSchoolId,
				serverFormData
			).then(() => ClubsHelper.redirectToClubListPage());
		}
	},
	render() {
		const binding = this.getDefaultBinding();

		return (
			<ClubForm
				title="Add new club..."
				activeSchoolId={this.props.activeSchoolId}
				onFormSubmit={this.submitAdd}
				binding={binding.sub('clubsForm')}
			/>
		)
	}
});