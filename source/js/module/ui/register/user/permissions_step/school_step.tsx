import * as React from 'react';
import * as Morearty from 'morearty';
import * as Form from 'module/ui/form/form';
import * as FormField from 'module/ui/form/form_field';
import {School} from 'module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item';
import {TYPE_USER} from './register_user_type';
import * as PostcodeSelector from 'module/ui/postcode_selector/postcode_selector';
import * as GeoSearchHelper from 'module/helpers/geo_search_helper';

export const SchoolStep = (React as any).createClass({
	mixins: [Morearty.Mixin],
	getSchoolService: function() {
		const postcode = this.getDefaultBinding().toJS('postcode');

		return (schoolName) => {
			const filter: any = {
				filter: {
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
					filter.filter.where.kind = { $in:["School","SchoolUnion"] };
					break;
			}

			if(typeof postcode !== 'undefined') {
				filter.filter.where['postcode.point'] = GeoSearchHelper.getUnlimitedGeoSchoolFilter(postcode.point);
			} else {
				filter.filter.order = "name ASC";
			}

			return (window as any).Server.publicSchools.get(filter);
		};
	},

	handleSelectSchool: function(schoolId: string, schoolData: School): void {
		this.selectedSchool = schoolData;
	},

	onSubmit: function (data): void {
		this.props.handleChangeSchool(data, this.selectedSchool);
	},

	handleSelectPostcode: function(id: string, postcode): void {
		this.getDefaultBinding().set('postcode', postcode);
	},
	handleEscapePostcode: function(): void {
		this.getDefaultBinding().set('postcode', undefined);
	},

	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<Form
				binding         = {binding}
				onSubmit        = {this.onSubmit}
				onCancel        = {this.props.handleClickBack}
				rejectButtonText= 'Back'
			>
				<div className="eForm_field">
					<div className="eForm_fieldName">
						Postcode
					</div>
					<PostcodeSelector
						currentPostcode			= {binding.toJS('postcode')}
						handleSelectPostcode	= {this.handleSelectPostcode}
						handleEscapePostcode	= {this.handleEscapePostcode}
						extraCssStyle 			= {'mInline mRightMargin mWidth250'}
					/>
				</div>
				<FormField
					type			= "autocomplete"
					field			= "schoolId"
					serviceFullData	= { this.getSchoolService() }
					onSelect		= { this.handleSelectSchool }
					defaultItem		= { this.props.defaultSchool }
					validation 	    = "required"
				>
					School
				</FormField>
			</Form>
		);
	}
});