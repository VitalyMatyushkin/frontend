import * as React from 'react'
import * as Morearty from 'morearty'
import * as Immutable from 'immutable'

import * as Form from 'module/ui/form/form'
import * as FormColumn from 'module/ui/form/form_column'
import * as FormField from 'module/ui/form/form_field'
import * as SessionHelper from'module/helpers/session_helper';
import {ServiceList} from "module/core/service_list/service_list";

const Bootstrap = require('../../../../../styles/bootstrap-custom.scss');

const USER = require('module/helpers/consts/user');

export const GeneralSettingsPage = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function () {
		const	self	= this,
				binding	= self.getDefaultBinding();

		//binding.clear();
		(window.Server as ServiceList).profile.get().then(function (data) {
			binding.set(Immutable.fromJS(data));
		});
	},
	submitEdit: function(data) {
		const self = this;
		const binding = self.getDefaultBinding();
		const role = SessionHelper.getRoleFromSession(
			self.getMoreartyContext().getBinding().sub('userData')
		);

		if(!data.birthday) {
			data.birthday = null;
		}

		(window.Server as ServiceList).profile.put(data).then(data => {
			binding.set(
				Immutable.fromJS(data)
			);

			if(role){
				window.history.back();
			}
			else {
				window.location.reload();
			}
		});
	},
	
	getGender: function () {
		const gendersArray = [
			{
				text: 'Male',
				value: USER.GENDER.MALE
			},
			{
				text: 'Female',
				value: USER.GENDER.FEMALE
			},
			{
				text: 'Not defined',
				value: USER.GENDER.NOT_DEFINED
			}
		];
		return gendersArray;
	},

	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<div className="container">
				<Form
					formStyleClass 		= "bSettingsForm mLeft row"
					onSubmit 			= { this.submitEdit }
					binding 			= { binding }
					defaultButton 		= "Save"
					loadingButton 		= "Saving..."
					formButtonsClass 	= 'col-md-10 col-md-offset-1'
				>
					<FormColumn
						customStyle 	="col-md-5 col-md-offset-1"
					>
						<h3>YOUR PHOTO</h3>
						<FormField
							labelText 	= "+"
							type 		= "imageFile"
							typeOfFile 	= "image"
							field 		= "avatar"
						/>
					</FormColumn>
					<FormColumn
						customStyle 	="col-md-5"
					>
					<h3>SUMMARY</h3>
						<FormField
							type 		= "text"
							field 		= "firstName"
							validation 	= "required alphanumeric"
						>
							Name
						</FormField>
						<FormField
							type 		= "text"
							field 		= "lastName"
							validation 	= "required alphanumeric">
							Surname
						</FormField>
						<FormField
							type 		= "dropdown"
							field 		= "gender"
							options 	= { this.getGender() }
						>
							Gender
						</FormField>
						<FormField
							type 		="date"
							field 		="birthday"
							validation 	="birthday"
							region      ={this.props.region}
						>
							Date of birth
						</FormField>
						<h3>VERIFICATION INFORMATION</h3>
						<FormField
							type 			= "text"
							field 			= "email"
							validation 		= "required email"
							isDisabled 		= { true }
						>
							Email
						</FormField>
						<FormField
							type 		="phone"
							field 		="phone"
							validation 	="phone"
							isDisabled 	={ true }
						>
							Phone number
						</FormField>
						<br/>
					</FormColumn>
				</Form>
			</div>
		);
	}
});