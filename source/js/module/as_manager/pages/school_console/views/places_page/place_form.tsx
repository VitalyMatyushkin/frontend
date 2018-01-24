import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'

import * as BPromise from 'bluebird'

import * as Form from '../../../../../ui/form/form'
import * as FormField from '../../../../../ui/form/form_field'
import {Map} from '../../../../../ui/map/map2'
import {ServiceList} from "module/core/service_list/service_list";

export interface PlaceFormData {
	name: string,
	ownerId: string
	postcode: string
}

export const PlaceForm = (React as any).createClass({
	mixins: [Morearty.Mixin],

	DEFAULT_VENUE_POINT: { "lat": 50.832949, "lng": -0.246722 },

	getPoint() {
		const binding = this.getDefaultBinding();

		const postcode = binding.toJS('selectedPostcode');

		return typeof postcode !== 'undefined' ? postcode.point : this.DEFAULT_VENUE_POINT;
	},

	postcodeService(searchText: string): BPromise<any> {
		return (window.Server as ServiceList).postCodes.get(
			{
				filter: {
					where: {
						postcode: {
							like: searchText,
							options: 'i'
						}
					},
					limit: 10
				}
			});
	},

	onSelectPostcode(id: string, postcode: object) {
		this.getDefaultBinding().set('selectedPostcode', Immutable.fromJS(postcode))
	},

	render() {
		const selectedPostcode = this.getDefaultBinding().toJS('selectedPostcode');

		return (
			<Form
				name			= { this.props.title }
				onSubmit		= { this.props.onSubmit }
				onCancel		= { this.props.onCancel }
				binding			= { this.getDefaultBinding().sub('form') }
				defaultButton	= { 'Save' }
			>
				<FormField
					type		= 'text'
					field		= 'name'
					validation	= 'required'
				>
					Place name
				</FormField>
				<FormField
					type			= 'autocomplete'
					serviceFullData	= { this.postcodeService }
					defaultItem		= { selectedPostcode }
					serverField		= { 'postcode' }
					field			= 'postcode'
					onSelect		= { this.onSelectPostcode }
					validation		= 'required'
				>
					Postcode
				</FormField>
				<Map
					point				= {this.getPoint()}
					customStylingClass	= "eEvents_venue_map"
				/>
			</Form>
		);
	}
});