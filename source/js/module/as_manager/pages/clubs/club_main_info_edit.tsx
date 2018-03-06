import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'

import {ClubForm} from 'module/as_manager/pages/clubs/club_form/club_form'
import * as Loader  from 'module/ui/loader'

import * as ClubConsts from 'module/helpers/consts/clubs'
import * as EventConsts from 'module/helpers/consts/events'
import {ClubsHelper} from 'module/as_manager/pages/clubs/clubs_helper'

import {ServiceList} from "module/core/service_list/service_list";
import {ClubFormData} from "module/as_manager/pages/clubs/club_form/models/club_form_data";

import 'styles/ui/loader.scss'

export const ClubMainInfoEdit = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount() {
		const binding = this.getDefaultBinding();

		const clubId = this.props.clubId;

		binding.set('isSync', false);
		let club;
		if (typeof clubId !== 'undefined') {
			(window.Server as ServiceList).schoolClub.get(
				{
					schoolId:	this.props.activeSchoolId,
					clubId:		clubId
				}
			)
			.then(data => {
				club = data;

				return (window.Server as ServiceList).sport.get(club.sportId);
			})
			.then(sport => {
				binding.set('isSync', true);

				binding.set('clubsForm.startDate', new Date(Immutable.fromJS(club.schedule.startDate)));
				binding.set('clubsForm.finishDate', new Date(Immutable.fromJS(club.schedule.finishDate)));
				binding.set('clubsForm.time', Immutable.fromJS(club.schedule.time));

				let days = club.schedule.days;
				if(typeof days === 'undefined') {
					days = [];
				}
				binding.set(
					'clubsForm.days',
					Immutable.fromJS(
						ClubsHelper.convertWeekDaysFromServerToClient(days)
					)
				);

				binding.set('clubsForm.ages', Immutable.fromJS(club.ages));
				binding.set('clubsForm.gender', Immutable.fromJS(EventConsts.EVENT_GENDERS[club.gender]));
				binding.set('clubsForm.sport', Immutable.fromJS(sport));
				
				club.duration = club.schedule.duration;
				binding.set('clubsForm.form', Immutable.fromJS(club));
				binding.set('clubsForm.staff', Immutable.fromJS(club.staff));
				binding.set('clubsForm.form.price', Immutable.fromJS(club.price.price));
				binding.set(
					'clubsForm.form.priceType',
					Immutable.fromJS(
						ClubConsts.SERVER_TO_CLIENT_PRICING_MAPPING[club.price.priceType]
					)
				);
			});
		}
	},
	submitEdit(data: ClubFormData) {
		const binding = this.getDefaultBinding();

		const formDataDays = typeof this.getDefaultBinding().toJS('clubsForm.days') !== 'undefined' ?
			this.getDefaultBinding().toJS('clubsForm.days') :
			[];

		//week days is required
		if (formDataDays.length === 0) {
			binding.set('clubsForm.isRequiredErrorDays', true);
		} else {
			binding.set('clubsForm.isRequiredErrorDays', false);

			const submitData = ClubsHelper.convertClientToServerFormData(
				data,
				this.getDefaultBinding().toJS('clubsForm')
			);

			(window.Server as ServiceList).schoolClub.put(
				{
					schoolId:	this.props.activeSchoolId,
					clubId:		this.props.clubId
				},
				submitData
			).then(() => ClubsHelper.redirectToClubStudentEditPage(this.props.clubId));
		}
	},
	render() {
		const binding = this.getDefaultBinding();

		let clubForm = null;
		if(binding.toJS('isSync')) {
			clubForm = (
				<ClubForm
					title			= "Edit club..."
					activeSchoolId	= { this.props.activeSchoolId }
					onFormSubmit	= { this.submitEdit }
					binding			= { binding.sub('clubsForm') }
				/>
			)
		} else {
			clubForm = (
				<div className='bLoaderWrapper'>
					<Loader condition={true}/>
				</div>
			);
		}

		return clubForm;
	}
});