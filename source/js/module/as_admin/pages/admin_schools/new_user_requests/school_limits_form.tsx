import * as React from "react"
import * as Morearty from 'morearty'

import * as Form from 'module/ui/form/form'
import * as FormField from 'module/ui/form/form_field'

import {RolesHelper} from 'module/as_admin/pages/schools/roles_helper'
import * as MultiselectDropdown from 'module/ui/multiselect-dropdown/multiselect_dropdown'

export const SchoolLimitsForm = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSubmit: (React as any).PropTypes.func
	},
	//inverting the values to not change the field names on the server
	valueReader(value) {
		switch (value) {
			case true:	return false;
			case false:	return true;
		}
	},
	valueWriter(value) {
		switch (value) {
			case false: return true;
			case true:	return false;
		}
	},
	render: function () {
		return (
			<Form
				name 			= { this.props.title }
				binding 		= { this.getDefaultBinding().sub('form') }
				onSubmit 		= { this.props.onSubmit }
				submitOnEnter 	= { false }
			>
				<FormField
					valueReader = { this.valueReader }
					valueWriter = { this.valueWriter }
					classNames 	= "mWideSingleLine"
					type 		= "checkbox"
					field 		= "isClubsEnabled"
				>
					Disable clubs
				</FormField>
				<FormField
					valueReader = { this.valueReader }
					valueWriter = { this.valueWriter }
					classNames 	= "mWideSingleLine"
					type 		= "checkbox"
					field 		= "canPublishWebSite"
				>
					Disable publish web site
				</FormField>
				<FormField
					valueReader = { this.valueReader }
					valueWriter = { this.valueWriter }
					classNames 	= "mWideSingleLine"
					type 		= "checkbox"
					field 		= "canAcceptStaffRoles"
				>
					Disable accept staff roles
				</FormField>
				<FormField
					valueReader = { this.valueReader }
					valueWriter = { this.valueWriter }
					classNames 	= "mWideSingleLine"
					type 		= "checkbox"
					field 		= "isFavoriteSportsEnabled"
				>
					Disable favorite sports in limited school version
				</FormField>
				<div className="eForm_field">
					<div className="eForm_fieldName">
						Available roles
					</div>
					<MultiselectDropdown
						items			= { RolesHelper.getRoles() }
						selectedItems	= { () => {} }
						handleClickItem	= { () => {} }
						extraStyle		= 'mSmallWide'
					/>
				</div>
			</Form>
		);
	}
});