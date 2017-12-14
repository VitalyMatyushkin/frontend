/**
 * Created by Woland on 25.09.2017.
 */

const 	React 			= require('react'),
		Morearty 		= require('morearty'),
		Immutable 		= require('immutable'),
		propz 			= require('propz'),
	
		{Autocomplete} 	= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		{Button} 		= require('module/ui/button/button'),
		{If}			= require('module/ui/if/if'),
		{ConfirmPopup}	= require('module/ui/confirm_popup');

const StudentMergeComponentStyles = require('styles/pages/schools/b_school_student_merge.scss');

const StudentWithoutPermissionMergeComponent = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function(){
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				permissionId 	= routingData.permissionId,
				schoolId 		= routingData.schoolId;

		window.Server.permissionRequest.get({schoolId: schoolId, prId: permissionId}).then(permisionRequest => {
			binding.set('studentWithoutHistoryPermission', Immutable.fromJS(permisionRequest));
		});
	},
	serviceStudentsFilter: function(name) {
		const 	globalBinding = this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				schoolId 		= routingData.schoolId;
		
		let filter;
		
		if (name === '') {
			filter = { limit: 100 }
		} else {
			filter = {
				limit: 100,
				where: {
					$or: [
						{ firstName: { like: name, options: 'i'} },
						{ lastName: { like: name, options: 'i' }}
					]
				}
			}
		}
		
		return window.Server.schoolStudents.get(schoolId, { filter: filter }).then(students => {
				students.forEach(student => {
					const 	firstName 	= propz.get(student, ['firstName']),
							lastName 	= propz.get(student, ['lastName']),
							formName 	= propz.get(student, ['form', 'name']),
							dateOfBirth = propz.get(student, ['birthday']);
					
					let studentData;
					if (typeof firstName !== 'undefined') {
						studentData = `${firstName} `;
					}
					if (typeof lastName !== 'undefined') {
						studentData = studentData + `${lastName} `;
					}
					if (typeof formName !== 'undefined') {
						studentData = studentData + `Form: ${formName} `;
					}
					if (typeof dateOfBirth !== 'undefined') {
						studentData = studentData + `DOB: ${dateOfBirth}`;
					}
					student.data = studentData;
				});
				
				return students;
			},
			error => { console.error(error); }
		);
	},
	onSelectStudent: function(studentId) {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				schoolId 		= routingData.schoolId;
		//because service window.Server.user don't contain information about form
		const filter = {where: {_id : studentId}};
		
		window.Server.schoolStudents.get(schoolId, { filter: filter }).then(user => {
			//user it is array with one element
			binding.set('studentWithHistory', user[0]);
		});
	},
	onClickMergeButton: function(){
		const binding = this.getDefaultBinding();
		
		binding.set('isPopupOpen', true);
	},
	onPopupCancelClick: function(){
		const binding = this.getDefaultBinding();
		
		binding.set('isPopupOpen', false);
	},
	onPopupOkClick: function(){
		const 	binding 						= this.getDefaultBinding(),
				studentWithHistory 				= binding.toJS('studentWithHistory'),
				studentWithHistoryId 			= propz.get(studentWithHistory, ['id']),
				globalBinding 					= this.getMoreartyContext().getBinding(),
				studentWithoutHistoryPermission = binding.toJS('studentWithoutHistoryPermission'),
				studentWithoutHistoryId 		= propz.get(studentWithoutHistoryPermission, ['requesterId']),
				routingData 					= globalBinding.sub('routing.parameters').toJS(),
				schoolId 						= routingData.schoolId,
				permissionId 					= routingData.permissionId;
		
		binding.set('isPopupOpen', false);
		
		window.Server.schoolStudentMerge.post({schoolId, studentId: studentWithHistoryId}, {
			userId: 		studentWithoutHistoryId,
			permissionId: 	permissionId
		}).then(
			res => {
				window.simpleAlert(
					'Merged successfully',
					'Ok',
					() => {
						document.location.hash = this.props.afterSubmitPage;
					}
				);
			},
			err => {
				window.simpleAlert(
					'Unable to merge this student.\nCheck that following preconditions are passed: student not take part in any event, student not take part in any team, student have the only permission or contact support.',
					'Ok',
					() => {}
				);
				console.error(err.message);
			}
		);
	},
	onClickCancelButton: function(){
		window.history.back();
	},
	render: function(){
		const 	binding 						= this.getDefaultBinding(),
				isPopupOpen 					= Boolean(binding.toJS('isPopupOpen')),
				studentWithHistory 				= binding.toJS('studentWithHistory'),
				studentWithHistoryFirstName 	= propz.get(studentWithHistory, ['firstName']),
				studentWithHistoryLastName 		= propz.get(studentWithHistory, ['lastName']),
				studentWithHistoryEmail 		= propz.get(studentWithHistory, ['email']),
				studentWithHistoryId 			= propz.get(studentWithHistory, ['id']),
				studentWithHistoryIdFormName 	= propz.get(studentWithHistory, ['form', 'name']),
				studentWithHistoryIdDOB 		= propz.get(studentWithHistory, ['birthday']),
				studentWithoutHistoryPermission = binding.toJS('studentWithoutHistoryPermission'),
				studentWithoutHistoryFirstName 	= propz.get(studentWithoutHistoryPermission, ['requester', 'firstName']),
				studentWithoutHistoryLastName 	= propz.get(studentWithoutHistoryPermission, ['requester', 'lastName']),
				studentWithoutHistoryEmail 		= propz.get(studentWithoutHistoryPermission, ['requester', 'email']),
				studentWithoutHistoryId 		= propz.get(studentWithoutHistoryPermission, ['requesterId']);

		return (
			<div>
				<div className="bStudentMerge">
					<p>
						{`Choose the existing student to merge with the request for the role on behalf of`}
						<br />
						{`${studentWithoutHistoryFirstName} ${studentWithoutHistoryLastName}`}
					</p>
					<div className="eStudentMergeAutocomplete">
						<Autocomplete
							serviceFilter	= { this.serviceStudentsFilter }
							serverField		= 'data'
							onSelect		= { this.onSelectStudent }
							binding			= { binding.sub('_studentAutocomplete') }
							placeholder		= 'Student name'
						/>
					</div>
					<Button
						text 				= "Cancel"
						onClick 			= { this.onClickCancelButton }
						extraStyleClasses 	= "mCancel"
					/>
					<Button
						text 				= "Merge"
						onClick 			= { this.onClickMergeButton }
						extraStyleClasses 	= "eStudentMergeButton"
						isDisabled 			= { typeof binding.toJS('studentWithHistory') === 'undefined' }
					/>
				</div>
				<If condition = {isPopupOpen}>
					<ConfirmPopup
						isOkButtonDisabled			= { false }
						customStyle 				= { 'ePopup mTextAlignCenter' }
						okButtonText 				= { "Merge" }
						cancelButtonText 			= { 'Cancel' }
						handleClickOkButton 		= { this.onPopupOkClick }
						handleClickCancelButton 	= { this.onPopupCancelClick }
						customFooterStyle 			= { 'mTextAlignCenter' }
					>
						<p>
							{`${studentWithHistoryFirstName} ${studentWithHistoryLastName} ${studentWithHistoryIdFormName} ${studentWithHistoryIdDOB}`}
							<br />
							{`will be merged with the request for the role on behalf of`}
							<br />
							{`${studentWithoutHistoryFirstName} ${studentWithoutHistoryLastName}`}
						</p>
						<p>
							Are you sure?
						</p>
					</ConfirmPopup>
				</If>
			</div>
		);
	}
});

module.exports = StudentWithoutPermissionMergeComponent;