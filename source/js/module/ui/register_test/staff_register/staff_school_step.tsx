import * as React from 'react';
import * as Morearty from 'morearty';
import * as roleList from 'module/data/roles_data';
import * as Form from 'module/ui/form/form';
import * as FormField from 'module/ui/form/form_field';
import {School} from 'module/ui/autocomplete2/custom_list_items/school_list_item/school_list_item.tsx';

const STAFF_ROLES = ['Teacher', 'Coach', 'School Admin', 'School Manager'];

export const StaffSchoolStep = (React as any).createClass({
	mixins: [Morearty.Mixin],
	getSchoolService: function() {
		return (schoolName) => {
			return (window as any).Server.publicSchools.get( {
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
					limit: 1000,
					order: 'name ASC'
				}
			});
		};
	},

	handleSelectSchool: function(schoolId: string, schoolData: School): void {
		this.selectedSchool = schoolData;
	},

	onSubmit: function (data): void {
		this.props.handleChangeSchoolAndRole(data, this.selectedSchool);
	},

	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<Form
				binding             = {binding}
				onSubmit	        = {this.onSubmit}
				onCancel            = {this.props.handleClickBack}
				rejectButtonText    = 'Back'
			>
				<FormField
					type			= "autocomplete"
					field			= "schoolId"
					onSelect		= { this.handleSelectSchool }
					serviceFullData	= { this.getSchoolService() }
					defaultItem		= { this.props.defaultSchool }
					validation 	    = "required"
				>
					School
				</FormField>
				<FormField
					type     	    = 'dropdown'
					field		    = "preset"
					options 	    = {STAFF_ROLES}
				>
					Role
				</FormField>

			</Form>
		);
	}
});