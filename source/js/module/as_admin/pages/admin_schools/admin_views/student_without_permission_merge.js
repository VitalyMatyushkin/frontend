/**
 * Created by Woland on 26.09.2017.
 */


const 	React 			= require('react'),
		Morearty 		= require('morearty'),
		Immutable 		= require('immutable'),
		propz 			= require('propz'),
	
		Autocomplete 	= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		Button 			= require('module/ui/button/button'),
		If 				= require('module/ui/if/if'),
		ConfirmPopup 	= require('module/ui/confirm_popup');

const StudentMergeComponentStyles = require('styles/pages/schools/b_school_student_merge.scss');

const StudentWithoutPermissionMergeComponent = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function(){
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				permissionId 	= routingData.permissionId;
		
		window.Server.permissionRequest.get({prId: permissionId}).then(permisionRequest => {
			binding.set('studentWithoutHistoryPermission', Immutable.fromJS(permisionRequest));
		});
	},
	componentWillUnmount: function(){
		const binding = this.getDefaultBinding();
		binding.clear();
	},
	serviceStudentsFilter: function(name) {
		const 	globalBinding = this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				schoolId 		= routingData.schoolId;
		
		let filter;
		
		if (name === '') {
			filter = {
				limit: 100
			}
		} else {
			filter = {
				limit: 100,
				where: {
					$or: [
						{
							firstName: {
								like: name,
								options: 'i'
							}
						},
						{
							lastName: {
								like: name,
								options: 'i'
							}
						}
					]
				}
			}
		}
		
		return window.Server.schoolStudents.get(
			schoolId,
			{ filter: filter }
		)
		.then(
			students => {
				students.forEach(student => {
					student.name = student.firstName + " " + student.lastName;
				});
				
				return students;
			},
			error => {
				console.error(error);
			}
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
				studentWithoutHistoryPermission = binding.toJS('studentWithoutHistoryPermission'),
				studentWithoutHistoryId 		= propz.get(studentWithoutHistoryPermission, ['requesterId']),
				globalBinding 					= this.getMoreartyContext().getBinding(),
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
					'Error (see in console)',
					'Ok',
					() => {}
				);
				console.error(err.message);
			}
		);
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
					<p>{`You want merge student with history`}</p>
					<div className="eStudentMergeAutocomplete">
						<Autocomplete
							serviceFilter	= { this.serviceStudentsFilter}
							serverField		= 'name'
							onSelect		= { this.onSelectStudent }
							binding			= { binding.sub('_studentAutocomplete') }
							placeholder		= 'Student name'
						/>
					</div>
					<p>{`with student without history`}</p>
					<p>{`${studentWithoutHistoryFirstName} ${studentWithoutHistoryLastName}`}</p>
					<Button
						text 				= "Merge"
						onClick 			= { this.onClickMergeButton }
						extraStyleClasses 	= "eStudentMergeButton"
						isDisabled 			= { typeof binding.toJS('studentWithHistory') === 'undefined' }
					/>
					<div className="eStudentMergeNote">
						<h3>
							Note:
						</h3>
						<ul>
							<li>The student without history should not have events</li>
							<li>The student without history should not have than one permission</li>
							<li>The student without history should not be a member of a team</li>
						</ul>
					</div>
				</div>
				<If condition = {isPopupOpen}>
					<ConfirmPopup
						isOkButtonDisabled			= { false }
						customStyle 				= { 'ePopup' }
						okButtonText 				= { "Merge" }
						cancelButtonText 			= { 'Cancel' }
						handleClickOkButton 		= { this.onPopupOkClick }
						handleClickCancelButton 	= { this.onPopupCancelClick }
					>
						<p>
							{`You going to merge following students:`}
							<br />
							{
								`* ${studentWithHistoryFirstName} ${studentWithHistoryLastName} [with history, email=${studentWithHistoryEmail} id=${studentWithHistoryId},
								form=${studentWithHistoryIdFormName}, birthday=${studentWithHistoryIdDOB}]`
							}
							<br />
							{`* ${studentWithoutHistoryFirstName} ${studentWithoutHistoryLastName} [no history, email=${studentWithoutHistoryEmail} id=${studentWithoutHistoryId}]`}
						</p>
						<p>
							As result of this operation student will have following credentials:<br />
							{`* First name: ${studentWithHistoryFirstName}`}<br />
							{`* Last name: ${studentWithHistoryLastName}`}<br />
							{`* Email: ${studentWithoutHistoryEmail}`}<br />
							{`while user with ${studentWithoutHistoryId} will be changed in status to 'REMOVED'`}
						</p>
						<p>
							Are you really sure?
						</p>
					</ConfirmPopup>
				</If>
			</div>
		);
	}
});

module.exports = StudentWithoutPermissionMergeComponent;