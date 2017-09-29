/**
 * Created by Woland on 22.09.2017.
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

const StudentWithPermissionMergeComponent = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillMount: function(){
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				schoolId 		= globalBinding.get('routing.pathParameters.0'),
				studentId 		= globalBinding.get('routing.pathParameters.3');

		window.Server.schoolStudent.get({schoolId, studentId}).then(student => {
			binding.atomically()
			.set('studentWithHistory', Immutable.fromJS(student))
			.set('isSync', true)
			.commit();
		});
	},
	componentWillUnmount: function(){
		const binding = this.getDefaultBinding();
		binding.clear();
	},
	serviceStudentsFilter: function(name) {
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				schoolId 		= globalBinding.get('routing.pathParameters.0');
		
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
		const binding = this.getDefaultBinding();
		
		window.Server.user.get({userId: studentId}).then(user => {
			binding.set('studentWithoutHistory', user);
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
		const 	binding 				= this.getDefaultBinding(),
				studentWithoutHistory 	= binding.toJS('studentWithoutHistory'),
				studentWithoutHistoryId = propz.get(studentWithoutHistory, ['id']),
				globalBinding 			= this.getMoreartyContext().getBinding(),
				schoolId 				= globalBinding.get('routing.pathParameters.0'),
				studentWithHistoryId 	= globalBinding.get('routing.pathParameters.3');
		
		binding.set('isPopupOpen', false);
		
		window.Server.schoolStudentMerge.post({schoolId, studentId: studentWithHistoryId}, {userId: studentWithoutHistoryId}).then(
			res => {
				window.simpleAlert(
					'Merged successfully',
					'Ok',
					() => {
						document.location.hash = `school_sandbox/${schoolId}/students`;
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
				studentWithHistory 				= binding.toJS('studentWithHistory'),
				studentWithHistoryFirstName 	= propz.get(studentWithHistory, ['firstName']),
				studentWithHistoryLastName 		= propz.get(studentWithHistory, ['lastName']),
				studentWithHistoryEmail 		= propz.get(studentWithHistory, ['email']),
				studentWithHistoryId 			= propz.get(studentWithHistory, ['id']),
				studentWithoutHistory 			= binding.toJS('studentWithoutHistory'),
				studentWithoutHistoryId 		= propz.get(studentWithoutHistory, ['id']),
				studentWithoutHistoryFirstName 	= propz.get(studentWithoutHistory, ['firstName']),
				studentWithoutHistoryLastName 	= propz.get(studentWithoutHistory, ['lastName']),
				studentWithoutHistoryEmail 		= propz.get(studentWithoutHistory, ['email']),
				isSync 							= Boolean(binding.toJS('isSync')),
				isPopupOpen 					= Boolean(binding.toJS('isPopupOpen'));

		if (isSync) {
			return (
				<div>
					<div className="bStudentMerge">
						<p>{`You want merge student with history`}</p>
						<p>{`${studentWithHistoryFirstName} ${studentWithHistoryLastName}`}</p>
						<p>{`with student without history`}</p>
						<Autocomplete
							serviceFilter	= { this.serviceStudentsFilter}
							serverField		= 'name'
							onSelect		= { this.onSelectStudent }
							binding			= { binding.sub('_studentAutocomplete') }
							placeholder		= 'Student name'
						/>
						<Button
							text 				= "Merge"
							onClick 			= { this.onClickMergeButton }
							extraStyleClasses 	= "eStudentMergeButton"
							isDisabled 			= { typeof binding.toJS('studentWithoutHistory') === 'undefined' }
						/>
						<div className="eStudentMergeNote">
							<h3>
								Note:
							</h3>
							<ul>
								<li>The student without history should not has events</li>
								<li>The student without history should not has than one permission</li>
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
								{`You going to merge following students:`}<br />
								{`* ${studentWithHistoryFirstName} ${studentWithHistoryLastName} [with history, email=${studentWithHistoryEmail} id=${studentWithHistoryId}]`}<br />
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
		} else {
			return null;
		}

	}
});

module.exports = StudentWithPermissionMergeComponent;