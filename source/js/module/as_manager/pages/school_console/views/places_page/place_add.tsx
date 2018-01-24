import * as React from 'react'
import * as Morearty from 'morearty'

import * as MoreartyHelper from '../../../../../helpers/morearty_helper'
import {PlaceHelper} from './place_helper'
import {PlaceForm, PlaceFormData} from './place_form'

import {ServiceList} from "module/core/service_list/service_list"

export const PlaceAdd = (React as any).createClass({
	mixins: [Morearty.Mixin],
	
	componentWillMount() {
		this.activeSchoolId = MoreartyHelper.getActiveSchoolId(this);
	},
	
	componentWillUnmount() {
		this.getDefaultBinding().clear();
	},
	
	onSubmit: function(data: PlaceFormData) {
		(window.Server as ServiceList).schoolPlaces.post(
			this.activeSchoolId,
			{
				name: data.name,
				postcodeId: data.postcode
			}
		).then(() => PlaceHelper.redirectToPlaceListPage());
	},
	
	render() {
		return (
			<div className="container">
				<PlaceForm
					activeSchoolId	= { this.activeSchoolId }
					title			= { 'Add new place' }
					onSubmit		= { this.onSubmit }
					binding			= { this.getDefaultBinding() }
					onCancel 		= { () => {window.history.back()} }
				/>
			</div>
		);
	}
});