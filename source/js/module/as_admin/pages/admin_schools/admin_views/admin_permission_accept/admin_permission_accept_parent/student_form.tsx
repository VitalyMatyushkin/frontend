import * as React from 'react';
import * as Morearty from 'morearty';
import * as Promise from 'bluebird';
import * as Form from 'module/ui/form/form';
import * as FormField from 'module/ui/form/form_field';
import * as FormTitle from 'module/ui/form/form_title';

/** Tiny student-related Form wrapper */
export const StudentForm = (React as any).createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		schoolId:		(React as any).PropTypes.string.isRequired,
		onFormSubmit:	(React as any).PropTypes.func.isRequired,
		onClickBack:	(React as any).PropTypes.func.isRequired,
		initialForm:	(React as any).PropTypes.object,
		initialHouse:	(React as any).PropTypes.object
	},
	componentWillUnmount: function() {
		this.getDefaultBinding().sub('studentForm').clear();
	},
	getClassService: function () {
		return  (txt) => {
			return (window as any).Server.schoolForms.get(
				{
					schoolId: this.props.schoolId,
					filter: {
						where: {
							name: {
								like: txt
							}
						},
						limit: 100
					}
				});
		}
	},
	getHouseService: function () {
		return (txt) => {
			return (window as any).Server.schoolHouses.get(
				{
					schoolId: this.props.schoolId,
					filter: {
						where: {
							name: {
								like: txt
							}
						},
						limit: 100
					}
				});
		}
	},
	getGender: function () {
		const gendersArray = [
			{
				value: 'boy',
				id: 'MALE'
			},
			{
				value: 'girl',
				id: 'FEMALE'
			}
		];

		return Promise.resolve(gendersArray);
	},

	render: function () {
		const binding = this.getDefaultBinding();

		return (
			<div className='eStudentForm'>
				<Form
					onSubmit		= { this.props.onFormSubmit }
					onCancel        = { this.props.onClickBack }
					binding			= { binding.sub('studentForm') }
					submitOnEnter	= { false }
					submitButtonId	= 'student_submit'
					cancelButtonId	= 'student_cancel'
				>
					<FormTitle text={'Add student'}/>
					<FormField
						labelText	='+'
						type		= 'imageFile'
						field		= 'avatar'
						id			= 'student_avatar'
					/>
					<FormField
						type		= 'text'
						field		= 'firstName'
						validation	= 'required'
						id			= 'student_name'
					>
						Name
					</FormField>
					<FormField
						type		= 'text'
						field		= 'lastName'
						validation	= 'required'
						id			= 'student_surname'
					>
						Surname
					</FormField>
					<FormField
						type			= 'radio'
						field			= 'gender'
						sourcePromise	= { this.getGender }
						validation		= 'required'
						id 				= 'student_gender'
					>
						Gender
					</FormField>
					<FormField
						type		= 'date'
						field		= 'birthday'
						validation	= 'birthday'
						id 			= 'student_birthday'
					>
						Date of birth
					</FormField>
					<FormField
						type			= 'autocomplete'
						serviceFullData	= { this.getClassService() }
						field			= 'formId'
						defaultItem		= { this.props.initialForm }
						id 				= 'student_class_combox'
					>
						Form
					</FormField>
					<FormField
						type			= 'autocomplete'
						serviceFullData	= { this.getHouseService() }
						field			= 'houseId'
						defaultItem		= { this.props.initialHouse }
						id 				= 'student_house_combox'
					>
						House
					</FormField>
					<FormField
						classNames	= 'mSingleLine'
						type		= 'checkbox'
						field		= 'unwell'
						id 			= 'student_injured_checkbox'
					>
						Injured/Unwell
					</FormField>
					<FormField
						type	= 'textarea'
						field	= 'medicalInfo'
						id 		= 'student_medicalinfo'
					>
						Medical Information
					</FormField>
				</Form>
			</div>
		)
	}
});