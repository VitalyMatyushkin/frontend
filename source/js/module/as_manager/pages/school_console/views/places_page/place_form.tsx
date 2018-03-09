import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'

import * as BPromise from 'bluebird'

import * as Form from '../../../../../ui/form/form'
import * as FormField from '../../../../../ui/form/form_field'
import {Map, Point} from '../../../../../ui/map/map2_editable'
import {ServiceList} from "module/core/service_list/service_list";

export interface PlaceFormData {
	name: string,
	ownerId: string
	postcode: string
	point: Point,
	isHome: boolean
}

interface Postcode {
	id: string
	point: Point
	postcode: string
	postcodeNoSpaces: string
}

export const PlaceForm = (React as any).createClass({
	mixins: [Morearty.Mixin],

	DEFAULT_VENUE_POINT: { coordinates: [-0.246722, 50.832949]},

	getPoint() {
		const point = this.getDefaultBinding().toJS('point');

		return typeof point !== 'undefined' ? point : this.DEFAULT_VENUE_POINT;
	},

	getNewPoint(point) {
		this.getDefaultBinding().set('point', Immutable.fromJS(point));
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

	onSelectPostcode(id: string, postcode: Postcode) {
		this.getDefaultBinding().set('selectedPostcode', Immutable.fromJS(postcode));
		this.getDefaultBinding().set('point', Immutable.fromJS(postcode.point));
	},

	onSubmit(data) {
		data.point = this.getDefaultBinding().toJS('point');
		this.props.onSubmit(data);
	},

	render() {
		const selectedPostcode = this.getDefaultBinding().toJS('selectedPostcode');

		return (
			<Form
				name			= { this.props.title }
				onSubmit		= { this.onSubmit }
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
					classNames	= 'mSingleLine'
					type		= 'checkbox'
					field		= 'isHome'
				>
					Home place
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
					key                 = { selectedPostcode ? selectedPostcode.id : 'emptyPostcode' }
					point				= { this.getPoint() }
					getNewPoint         = { this.getNewPoint }
					customStylingClass	= "eEvents_venue_map"
				/>
			</Form>
		);
	}
});