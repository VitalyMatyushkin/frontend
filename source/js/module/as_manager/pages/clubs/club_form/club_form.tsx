import * as React from 'react'
import * as Immutable from 'immutable'
import * as propz from 'propz'
import * as Morearty from 'morearty'

import * as Form from 'module/ui/form/form'
import * as FormField from 'module/ui/form/form_field'
import * as FormColumn from 'module/ui/form/form_column'
import {Ages} from 'module/as_manager/pages/clubs/club_form/components/ages'
import * as FullTimeInput from 'module/ui/full_time_input/full_time_input'
import {GenderSelectorWrapper} from 'module/as_manager/pages/events/manager/event_form/components/gender_selector/gender_selector_wrapper'
import * as MultiselectDropdown from 'module/ui/multiselect-dropdown/multiselect_dropdown'
import * as Personal from 'module/as_manager/pages/event/view/details/details_components/personal/personal'
import * as Loader from 'module/ui/loader'
import {MonthCalendar} from 'module/ui/calendar/month_calendar'

import * as TeamHelper from 'module/ui/managers/helpers/team_helper'
import * as GenderHelper from 'module/helpers/gender_helper'
import {ClubsHelper} from 'module/as_manager/pages/clubs/clubs_helper'
import * as CurrencySymbol from 'module/data/currancy_symbol'
import * as Consts from 'module/as_manager/pages/event/view/details/details_components/consts'
import * as ClubsConst from 'module/helpers/consts/clubs'

import {ClubsActions} from 'module/as_manager/pages/clubs/clubs_actions'
import {Sport} from "module/models/sport/sport";
import {Place} from "module/models/place/place";
import {Profile} from "module/models/profile/profile";
import {Permission} from "module/models/permission/permission";

const LoaderStyle = require('styles/ui/loader.scss');

export interface WeekDay {
	id: string
	value: string
}

export interface AgeItem {
	id: string
	value: string
}

export interface StaffProfile extends Profile {
	userId?: string
	permissionId?: string

	permissions?: Permission[]
}

export const ClubForm = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title:			(React as any).PropTypes.string.isRequired,
		activeSchoolId:	(React as any).PropTypes.string.isRequired,
		onFormSubmit:	(React as any).PropTypes.func.isRequired
	},
	componentWillMount() {
		const binding = this.getDefaultBinding();

		binding.toJS('isSync', false);

		// shedule
		let startDate = binding.toJS('startDate');
		if(typeof startDate === 'undefined') {
			startDate = new Date();
			binding.set('startDate', Immutable.fromJS(startDate));
		}

		let finishDate = binding.toJS('finishDate');
		if(typeof finishDate === 'undefined') {
			finishDate = new Date();
			binding.set('finishDate', Immutable.fromJS(finishDate));
		}

		let time = binding.toJS('time');
		if(typeof time === 'undefined') {
			time = new Date();
			time.setHours(10);
			time.setMinutes(0);
			binding.set('time', Immutable.fromJS(time));
		}

		let days = binding.toJS('days');
		if(typeof days === 'undefined') {
			binding.set('days', Immutable.fromJS([]));
		}
		
		let staff =  binding.toJS('staff');
		if(typeof staff === 'undefined') {
			binding.set('staff', Immutable.fromJS([]));
		}
		
		let school;
		window.Server.school.get(this.props.activeSchoolId).then(_school => {
			school = _school;

			return window.Server.schoolForms.get(this.props.activeSchoolId, {filter:{limit:1000}});
		}).then(forms => {
			school.forms = forms;

			if(typeof binding.toJS('ages') === 'undefined') {
				binding.set('ages', Immutable.fromJS([]));
			}
			binding.set('school', Immutable.fromJS(school));
			binding.set('isSync', true);
		});
	},
	/**
	 * When the user leaves the tab with the form, it is checked whether the fields changed their default values.
	 * If changed and if the user has not yet sent them to the server, a dialog box will be called,
	 * which will ask about saving the changes.
	 */
	componentWillUnmount() {
		const 	binding 			= this.getDefaultBinding(),
				initStateOfForm 	= binding.toJS('initStateOfForm'),
				currentStateOfForm 	= binding.sub('form').meta().get().toJS(),
				isFormAlreadySend 	= typeof binding.toJS('isFormAlreadySend') !== 'undefined' ? binding.toJS('isFormAlreadySend') : false;

		if(isFormAlreadySend){
			binding.clear();
		} else {
			let isFormChange = false;

			for (let key in currentStateOfForm) {
				switch (key){
					case 'buttonText':
						break;
					case 'venue':
						if (initStateOfForm['venue']['placeId'].value !== currentStateOfForm['venue']['placeId'].value){
							isFormChange = true;
						}
						break;
					default:
						if (initStateOfForm[key].defaultValue !== currentStateOfForm[key].value){
							isFormChange = true;
						}
						break;
				}
			}

			if (isFormChange){
				let dataToSubmit = {};
				for (let key in currentStateOfForm) {
					if (key === 'venue') {
						propz.set(dataToSubmit, ['venue', 'placeId'], currentStateOfForm['venue']['placeId'].value);
					} else {
						dataToSubmit[key] = currentStateOfForm[key].value;
					}
				}
				window.confirmAlert(
					`Do you want to save the changes?`,
					"Ok",
					"Cancel",
					() => {
						propz.set(dataToSubmit, ['isNeedRedirect'], false);
						this.props.onFormSubmit(dataToSubmit);
						binding.clear();
					},
					() => {
						binding.clear();
					}
				);
			}
		}
	},
	saveInitStateOfForm() {
		const binding = this.getDefaultBinding();
		const bindingFormData = binding.sub('form').meta().get().toJS();

		binding.set('initStateOfForm', Immutable.fromJS(bindingFormData));
	},
	isShowPriceNumberField() {
		const metaPriceTypeField = this.getDefaultBinding().sub('form').meta().toJS('priceType');

		return propz.get(metaPriceTypeField, ['value'], undefined) !== ClubsConst.PRICING.FREE;
	},
	getDateObjectFromTime() {
		const binding = this.getDefaultBinding();

		const	timeString = binding.toJS('time'),
				dateObject = new Date(timeString);

		return dateObject;
	},
	getWeekDays(): WeekDay[] {
		return ClubsHelper.getWeekDays();
	},
	getSelectedWeekDays() {
		return this.getDefaultBinding().toJS('days');
	},
	handleFormComponentDidMount() {
		this.saveInitStateOfForm();
	},
	handleSelectWeekDay(day: WeekDay) {
		const binding = this.getDefaultBinding();

		const days = binding.toJS('days');

		const dayIndex = days.findIndex(_d => _d.id === day.id);

		if(dayIndex !== -1) {
			days.splice(dayIndex, 1);
		} else {
			days.push(day);
		}

		binding.set('days', Immutable.fromJS(days));
	},
	handleChangeHour(hour: number) {
		const binding = this.getDefaultBinding();

		const	timeString = binding.toJS('time'),
			dateObject = new Date(timeString);

		dateObject.setHours(hour);

		binding.set('time', dateObject.toISOString());
	},
	handleChangeMinutes(minute: number) {
		const binding = this.getDefaultBinding();

		const	timeString = binding.toJS('time'),
			dateObject = new Date(timeString);

		dateObject.setMinutes(minute);

		binding.set('time', dateObject.toISOString());
	},
	handleChangePriceType() {
		if(!this.isShowPriceNumberField()) {
			this.getDefaultBinding().sub('form').meta().set('price.value', 0);
		}
	},
	handleClickAgeItem(ageItem: AgeItem) {
		const ages = this.getDefaultBinding().toJS('ages');

		const foundAgeIndex = ages.findIndex(a => a === ageItem.id);

		if(foundAgeIndex !== -1) {
			ages.splice(foundAgeIndex, 1);
		} else {
			ages.push(ageItem.id);
		}

		this.getDefaultBinding().set('ages', Immutable.fromJS(ages));
	},
	handleChangeGender(gender: 'mixed'|'femaleOnly'|'maleOnly') {
		this.getDefaultBinding().set('gender', Immutable.fromJS(gender));
	},
	handleChangeSport(sportId: string, sport: Sport) {
		this.getDefaultBinding().set(
			'sport',
			Immutable.fromJS(sport)
		);
		this.getDefaultBinding().set(
			'sportId',
			Immutable.fromJS(sport)
		);

		this.getDefaultBinding().set(
			'gender',
			Immutable.fromJS(
				GenderHelper.getDefaultGender(sport)
			)
		);
	},
	handleChangeVenue(venueId: string, venue: Place) {
		this.getDefaultBinding().set(
			'venue',
			Immutable.fromJS(venue)
		);
	},
	getCoaches() {
		const staff = this.getDefaultBinding().toJS('staff');
		return staff.filter(s => s.staffRole === Consts.STAFF_ROLES.COACH);
	},
	getMembersOfStaff() {
		const staff = this.getDefaultBinding().toJS('staff');
		return staff.filter(s => s.staffRole === Consts.STAFF_ROLES.MEMBER_OF_STAFF);
	},
	getCoachPermissionFromUser(user: StaffProfile) {
		const permissions =  user.permissions.filter(p =>
			(p.preset === 'COACH' || p.preset === 'TEACHER') &&
			p.schoolId === this.props.activeSchoolId &&
			p.status === 'ACTIVE'
		);
		
		return permissions.length !== 0 ? permissions[0] : {};
	},
	getMembersOfStaffPermissionFromUser(user: StaffProfile) {
		const permissions =  user.permissions.filter(p =>
			p.schoolId === this.props.activeSchoolId &&
			p.status === 'ACTIVE'
		);
		
		//TODO What if user has more then one active roles for current school?
		return permissions[0];
	},
	handleChangeCoaches(user: StaffProfile) {
		const updStaff = this.getDefaultBinding().toJS('staff');
		
		const permission = this.getCoachPermissionFromUser(user);
		
		if(typeof permission !== "undefined") {
			updStaff.push({
				userId			: user.id,
				permissionId	: permission.id,
				staffRole		: Consts.STAFF_ROLES.COACH,
				firstName		: user.firstName,
				lastName		: user.lastName
			});
			
			this.getDefaultBinding().set(
				'staff',
				Immutable.fromJS(updStaff)
			);
		}
	},
	handleChangeMembersOfStaff(user: StaffProfile) {
		const updStaff = this.getDefaultBinding().toJS('staff');
		
		const permission = this.getMembersOfStaffPermissionFromUser(user);
		
		updStaff.push({
			userId			: user.id,
			permissionId	: permission.id,
			staffRole		: Consts.STAFF_ROLES.MEMBER_OF_STAFF,
			firstName		: user.firstName,
			lastName		: user.lastName
		});
		
		this.getDefaultBinding().set(
			'staff',
			Immutable.fromJS(updStaff)
		);
	},
	handleDeletePersonal(user: StaffProfile) {
		let updStaff = this.getDefaultBinding().toJS('staff');
		
		const foundStaffIndex = updStaff.findIndex(staff => staff.userId === user.userId && staff.permissionId === user.permissionId);
		updStaff.splice(foundStaffIndex, 1);
		
		this.getDefaultBinding().set(
			'staff',
			Immutable.fromJS(updStaff)
		);
	},
	
	render() {
		const 	binding = this.getDefaultBinding(),
				venue = binding.toJS('form.venue'),
				defaultVenue =  typeof venue !== 'undefined' ? 	{id: venue.placeId, name:venue.placeName} : undefined;
		
		const	todayDate			= new Date(),
				monthStartDate		= binding.get('monthStartDate') ? binding.get('monthStartDate') : binding.get('startDate') ? binding.get('startDate') : new Date(),
				selectedStartDate	= binding.get('startDate'),
				monthEndDate		= binding.get('monthEndDate') ? binding.get('monthEndDate') : binding.get('finishDate') ? binding.get('finishDate') : new Date(),
				selectedEndDate		= binding.get('finishDate');

		let form = null;
		
		const   isRequiredError = Boolean(binding.toJS('isRequiredErrorDays')),
				isActiveClub = !!binding.sub('form') && binding.sub('form').toJS('status') === 'ACTIVE';

		if(binding.toJS('isSync')) {
			form = (
				<div className ="container">
					<Form
						name			= { this.props.title }
						onSubmit		= { this.props.onFormSubmit }
						binding			= { binding.sub('form') }
						submitButtonId	= 'club_submit'
						cancelButtonId	= 'club_cancel'
						submitOnEnter 	= { false }
						id 				= 'club_form'
						formStyleClass  = { isActiveClub ? 'eForm_disabled' : ''}
						hideSubmitButton= { isActiveClub }
						handleComponentDidMount={() => this.handleFormComponentDidMount()}
					>
						<FormColumn
							key			= 'column_1'
							customStyle	= 'col-md-5 col-md-offset-1'
						>
							<FormField
								type		= "text"
								field		= "name"
								validation	= "required"
							>
								Club name
							</FormField>
							<FormField
								type	= "textarea"
								field	= "description"
							>
								Description
							</FormField>
							<FormField
								field			= 'sportId'
								type			= 'autocomplete'
								defaultItem		= { binding.toJS('form.sport') }
								serviceFullData	= {
									ClubsActions.getSportsService(this.props.activeSchoolId)
								}
								onSelect		= { this.handleChangeSport }
								validation		= "required"
							>
								Sport
							</FormField>
							<div className="eForm_field mBlue">
								<div className="eForm_fieldName">
									Gender
								</div>
								<GenderSelectorWrapper
									gender				= { binding.toJS('gender') }
									sport				= { binding.toJS('sport') }
									handleChangeGender	= { this.handleChangeGender }
									extraStyle			= { 'mSmallView' }
								/>
							</div>
							<div className="eForm_field">
								<div className="eForm_fieldName">
									Ages
								</div>
								<Ages
									ageGroupsNaming	= { binding.toJS('school.ageGroupsNaming') }
									availableAges	= { TeamHelper.getAges(binding.toJS('school')) }
									ages			= { binding.toJS('ages') }
									handleClickItem	= { this.handleClickAgeItem }
								/>
							</div>
							<FormField
								field			= 'maxParticipants'
								type			= 'number'
								validation		= 'required'
							>
								Maximum number of students
							</FormField>
							<FormField
								field		= 'priceType'
								type		= 'dropdown'
								options		= { ClubsConst.PRICING_ARRAY }
								onSelect	= { this.handleChangePriceType() }
							>
								Price Type
							</FormField>
							<FormField
								field			= 'price'
								type			= 'currency'
								isDisabled		= { !this.isShowPriceNumberField() }
								currencySymbol  = { CurrencySymbol.pound }
							>
								Price
							</FormField>
							<FormField
								field			= 'venue.placeId'
								type			= 'autocomplete'
								defaultItem		= { defaultVenue }
								serviceFullData	= {
									ClubsActions.getVenueService(this.props.activeSchoolId)
								}
								onSelect		= { this.handleChangeVenue }
								validation		= "required"
							>
								Venue
							</FormField>
							<div className="eForm_field">
								<div className="eForm_fieldName">
									Coach
								</div>
								<div className="eForm_fieldSet">
									<Personal
										mode			= {Consts.REPORT_FILED_VIEW_MODE.EDIT}
										activeSchoolId	= {this.props.activeSchoolId}
										personalList	= {this.getCoaches()}
										personalType	= {Consts.STAFF_ROLES.COACH}
										handleChange	= {this.handleChangeCoaches}
										handleDelete	= {this.handleDeletePersonal}
									/>
								</div>
							</div>
							<div className="eForm_field">
								<div className="eForm_fieldName">
									Members of staff
								</div>
								<div className="eForm_fieldSet">
									<Personal
										mode			= {Consts.REPORT_FILED_VIEW_MODE.EDIT}
										activeSchoolId	= {this.props.activeSchoolId}
										personalList	= {this.getMembersOfStaff()}
										personalType	= {Consts.STAFF_ROLES.MEMBER_OF_STAFF}
										handleChange	= {this.handleChangeMembersOfStaff}
										handleDelete	= {this.handleDeletePersonal}
									/>
								</div>
							</div>
						</FormColumn>
						<FormColumn
							key			= 'column_2'
							customStyle	= 'col-md-5 col-md-offset-1'
						>
							<div className="eForm_field">
								<div className="eForm_fieldName">
									Start date
								</div>
								<MonthCalendar
									todayDate		= {todayDate}
									monthDate		= {monthStartDate}
									selectedDate	= {selectedStartDate}
									onMonthClick	= { (date) => 	binding.set('monthStartDate', date) }
									onDateClick		= { (date) =>	binding.set('startDate', date) }
									customStyle		= { 'mAlignStart' }
								/>
							</div>
							<div className="eForm_field">
								<div className="eForm_fieldName">
									End date
								</div>
								<MonthCalendar
									todayDate		= {todayDate}
									monthDate		= {monthEndDate}
									selectedDate	= {selectedEndDate}
									onMonthClick	= { (date) => 	binding.set('monthEndDate', date) }
									onDateClick		= { (date) =>	binding.set('finishDate', date) }
									customStyle		= { 'mAlignStart' }
								/>
							</div>
							<div className="eForm_field">
								<div className="eForm_fieldName">
									Week days
								</div>
								<MultiselectDropdown
									items			= { this.getWeekDays() }
									selectedItems	= { this.getSelectedWeekDays() }
									handleClickItem	= { this.handleSelectWeekDay }
									extraStyle		= { isRequiredError ? 'mSmallWide mError' : 'mSmallWide' }
								/>
								{isRequiredError ?
									<div className="eForm_fieldValidIconCustom" title="Please enter Week days">⚠</div> : <div/>
								}
							</div>
							<div className="eForm_field">
								<div className="eForm_fieldName">
									Time
								</div>
								<FullTimeInput	hourValue			= { this.getDateObjectFromTime().getHours() }
												minutesValue		= { this.getDateObjectFromTime().getMinutes() }
												handleChangeHour	= { this.handleChangeHour }
												handleChangeMinutes	= { this.handleChangeMinutes }
								/>
							</div>
							<FormField
								field		= 'duration'
								type		= 'number'
								validation	= 'required'
							>
								Duration(min)
							</FormField>
						</FormColumn>
					</Form>
				</div>
			);
		} else {
			form = (
				<div className='bLoaderWrapper'>
					<Loader condition={ true }/>
				</div>
			);
		}

		return form;
	}
});