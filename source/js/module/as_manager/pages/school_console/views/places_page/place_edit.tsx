import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'

import * as MoreartyHelper from '../../../../../helpers/morearty_helper'
import {PlaceHelper} from './place_helper'
import {PlaceForm} from './place_form'

import {ServiceList} from "module/core/service_list/service_list";
import {PlaceFormData} from "module/as_manager/pages/school_console/views/places_page/place_form";

export const PlaceEdit = (React as any).createClass({
	mixins: [Morearty.Mixin],

	placeId: '',
	activeSchoolId: '',

	componentWillMount() {
		const	binding         = this.getDefaultBinding(),
				globalBinding   = this.getMoreartyContext().getBinding(),
				routingData     = globalBinding.sub('routing.parameters').toJS();

		this.placeId = routingData.id;
		this.activeSchoolId = MoreartyHelper.getActiveSchoolId(this);

		if (typeof this.placeId !== 'undefined') {
			let placeData;

			(window.Server as ServiceList).schoolPlace.get({
				schoolId: this.activeSchoolId,
				placeId: this.placeId
			}).then(_placeData => {
				placeData = _placeData;

				return (window.Server as ServiceList).postCodeById.get(placeData.postcodeId);
			}).then(postcodeData => {
				binding.atomically()
					.set('form', Immutable.fromJS({
						name: placeData.name,
						postcode: placeData.postcodeId
					}))
					.set('selectedPostcode', Immutable.fromJS(postcodeData))
					.set('isSync', true)
					.commit();
			});
		}
	},

	componentWillUnmount() {
		this.getDefaultBinding().clear();
	},


	onSubmit(data: PlaceFormData) {
		(window.Server as ServiceList).schoolPlace.put(
			{
				schoolId: this.activeSchoolId,
				placeId: this.placeId
			}, {
				name: data.name,
				postcodeId: data.postcode
			}
		).then(() => PlaceHelper.redirectToPlaceListPage());
	},

	render() {
		if(this.getDefaultBinding().toJS('isSync')) {
			return (
				<div className="container">
					<PlaceForm
						activeSchoolId	= { this.activeSchoolId }
						title			= { 'Edit place' }
						onSubmit		= { this.onSubmit }
						binding			= { this.getDefaultBinding() }
						onCancel 		= { () => {window.history.back()} }
					/>
				</div>
			);
		} else {
			return null;
		}
	}
});