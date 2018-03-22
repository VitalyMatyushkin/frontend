import * as React	 from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'

import {ConfirmPopup} from 'module/ui/confirm_popup'
import {PlaceForm} from '../../school_console/views/places_page/place_form'
import {ServiceList} from "module/core/service_list/service_list";
import {PlaceFormData} from "module/as_manager/pages/school_console/views/places_page/place_form";

export const PlacePopup = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		activeSchoolId: (React as any).PropTypes.string.isRequired,
		onSubmit:       (React as any).PropTypes.func.isRequired,
		onCancel:       (React as any).PropTypes.func.isRequired
	},

	componentWillMount() {
		const binding = this.getDefaultBinding();

		const postcodeData = binding.toJS('model.venue.postcodeData');

		const placeForm = {
			form: {
				name: undefined,
				postcode: postcodeData.id
			},
			selectedPostcode: postcodeData
		};

		binding.set('placeForm', Immutable.fromJS(placeForm));
	},

	onSubmit(data: PlaceFormData) {
		(window.Server as ServiceList).schoolPlaces.post(
			this.props.activeSchoolId,
			{
				name: data.name,
				postcodeId: data.postcode
			}
		).then(data => this.props.onSubmit(data));
	},

	render() {
		return (
			<ConfirmPopup isShowButtons = { false }>
				<PlaceForm
					activeSchoolId	= { this.props.activeSchoolId }
					binding         = { this.getDefaultBinding().sub('placeForm') }
					onSubmit        = { this.onSubmit }
					onCancel        = { this.props.onCancel }
				/>
			</ConfirmPopup>
		);
	}
});