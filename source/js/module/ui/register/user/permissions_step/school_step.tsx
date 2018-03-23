import * as React from 'react';
import * as Morearty from 'morearty';
import * as Form from 'module/ui/form/form';
import * as FormField from 'module/ui/form/form_field';
import {School} from 'module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item';
import {TYPE_USER} from './register_user_type';
import * as PostcodeSelector from 'module/ui/postcode_selector/postcode_selector';
import * as GeoSearchHelper from 'module/helpers/geo_search_helper';
import {ServiceList} from "module/core/service_list/service_list";
import {SchoolListItem} from 'module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item';
import * as BPromise from 'bluebird';
import * as Loader from 'module/ui/loader';

export const SchoolStep = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		this.schoolFieldKey = this.generateSchoolInputKey();
		this.defaultSchool = this.props.defaultSchool;
		this.getDefaultBinding().set('isSync', true);
	},

	generateSchoolInputKey: function() {
		// just current date in timestamp view
		return + new Date();
	},

	getSchoolService: function() {
		const   postcode    = this.getDefaultBinding().toJS('postcode'),
				region      = this.getDefaultBinding().toJS('region');

		return (schoolName) => {
			const filter: any = {
				filter: {
				    view: {
				        type: 'id_name_pic'
                    },
					where: {
						name: {
							like: schoolName,
							options: 'i'
						},
						/* this param was added later, so it is undefined on some schools. Default value is true.
						 * undefined considered as 'true'. So, just checking if it is not explicitly set to false
						 */
						availableForRegistration: { $ne: false }
					},
					limit: 1000
				}
			};
			switch (this.props.mode) {
				case TYPE_USER.STUDENT:
					filter.filter.where.allowedPermissionPresets = {STUDENT: { $ne: false }};
					filter.filter.where.studentSelfRegistrationEnabled = { $ne: false };
					filter.filter.where.kind = { $in:["School"] };
					break;
				case TYPE_USER.PARENT:
					filter.filter.where.allowedPermissionPresets = {PARENT: { $ne: false }};
					filter.filter.where.kind = { $in:["School"] };
					break;
				default:
					filter.filter.where.$or = [
						{'allowedPermissionPresets.ADMIN':     { $ne: false }},
						{'allowedPermissionPresets.MANAGER':   { $ne: false }},
						{'allowedPermissionPresets.TEACHER':   { $ne: false }},
						{'allowedPermissionPresets.COACH':     { $ne: false }}
					];
					filter.filter.where.kind = { $in:["School","SchoolUnion"] };
					break;
			}

			if(typeof postcode !== 'undefined') {
				filter.filter.where['postcode.point'] = GeoSearchHelper.getUnlimitedGeoSchoolFilter(postcode.point);
			} else {
				filter.filter.order = "name ASC";
			}

			if(typeof region !== 'undefined') {
				filter.filter.where.region = region;
			}

			return (window as any).Server.publicSchools.get(filter);
		};
	},

	handleSelectSchool: function(schoolId: string, schoolData: { id: string, name: string, pic: string}): void {
		// sorry for that. This is not very wise. But short :)
		this.selectedSchoolPromise = (window.Server as ServiceList).publicSchool.get({schoolId: schoolData.id});
	},

	onSubmit: function (data): void {
		this.getDefaultBinding().set('isSync', false);
		BPromise.resolve(this.selectedSchoolPromise).then( selectedSchoolData => {
			this.getDefaultBinding().set('isSync', true);
			this.props.handleChangeSchool(data, selectedSchoolData);
		});
	},

	handleSelectPostcode: function(id: string, postcode): void {
		this.getDefaultBinding().set('postcode', postcode);
		this.clearSchoolField();
	},

	clearSchoolField: function () {
		this.getDefaultBinding().meta().set('schoolId.value', undefined);
		this.schoolFieldKey = this.generateSchoolInputKey();
		this.defaultSchool = undefined;
	},

	handleEscapePostcode: function(): void {
		this.getDefaultBinding().set('postcode', undefined);
		this.clearSchoolField();
	},

	render: function() {
		const binding = this.getDefaultBinding();

		if (this.getDefaultBinding().get('isSync')) {
			return (
				<Form
					binding={binding}
					onSubmit={this.onSubmit}
					onCancel={this.props.handleClickBack}
					rejectButtonText='Back'
					defaultButton={this.props.mode === TYPE_USER.STUDENT ? 'Finish' : 'Continue'}
				>
					<div className="eForm_field">
						<div className="eForm_fieldName">
							Postcode
						</div>
						<PostcodeSelector
							region={binding.toJS('region')}
							currentPostcode={binding.toJS('postcode')}
							handleSelectPostcode={this.handleSelectPostcode}
							handleEscapePostcode={this.handleEscapePostcode}
							extraCssStyle={'mInline mRightMargin mWidth250'}
						/>
					</div>
					<FormField
						key={this.schoolFieldKey}
						type="autocomplete"
						field="schoolId"
						serviceFullData={this.getSchoolService()}
						onSelect={this.handleSelectSchool}
						defaultItem={this.defaultSchool}
						customListItem={SchoolListItem}
						validation="required"
					>
						School
					</FormField>
				</Form>
			);
		} else {
			return (
				<Loader/>
			);
		}
	}
});