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

		// using here "isSyncPlaceEdit" as sync flag because default binding already have 'isSync' property which
		// conflicts with some other component. I don't know which one exactly but under certain circumstances
		// components are start infinite race for this flag which leads to white screen 

		this.placeId = routingData.id;
		this.activeSchoolId = MoreartyHelper.getActiveSchoolId(this);

		if (typeof this.placeId !== 'undefined') {
			let placeData;

			binding.set('isSyncPlaceEdit', false);

			(window.Server as ServiceList).schoolPlace.get({
				schoolId: this.activeSchoolId,
				placeId: this.placeId
			}).then(_placeData => {
				placeData = _placeData;
				binding.set('point', Immutable.fromJS(_placeData.point));
				return (window.Server as ServiceList).postCodeById.get(placeData.postcodeId);
			}).then(postcodeData => {
				binding.atomically()
					.set('form', Immutable.fromJS({
						name: 		placeData.name,
						postcode: 	placeData.postcodeId,
						isHome: 	placeData.isHome
					}))
					.set('selectedPostcode', Immutable.fromJS(postcodeData))
					.set('isSyncPlaceEdit', true)
					.commit();

				console.log('place edit will mount');
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
				name: 		data.name,
				postcodeId: data.postcode,
				point: 		data.point,
				isHome: 	data.isHome
			}
		).then(() => PlaceHelper.redirectToPlaceListPage());
	},

	render() {

		if(this.getDefaultBinding().toJS('isSyncPlaceEdit')) {
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