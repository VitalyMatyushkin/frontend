/**
 * Created by Woland on 25.09.2017.
 */

const 	React 			= require('react'),
		Morearty 		= require('morearty'),
		Immutable 		= require('immutable'),
		Autocomplete 	= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		Button 			= require('module/ui/button/button'),
		If 				= require('module/ui/if/if'),
		ConfirmPopup 	= require('module/ui/confirm_popup');

const StudentMergeComponentStyles = require('styles/pages/schools/b_school_student_merge.scss');

const StudentWithoutPermissionMergeComponent = React.createClass({
	mixins: [Morearty.Mixin],
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
		const binding = this.getDefaultBinding();
		
		binding.set('studentWithHistoryId', studentId);
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
				studentWithHistoryId 	= binding.toJS('studentWithHistoryId'),
				globalBinding 			= this.getMoreartyContext().getBinding(),
				routingData 			= globalBinding.sub('routing.parameters').toJS(),
				studentWithoutHistoryId = routingData.studentId,
				schoolId 				= routingData.schoolId;
		
		binding.set('isPopupOpen', false);
		
		window.Server.schoolStudentMerge.post({schoolId, studentId: studentWithHistoryId}, {userId: studentWithoutHistoryId}).then(
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
		const 	binding 				= this.getDefaultBinding(),
				studentWithHistory 		= typeof binding.toJS('studentWithHistory') !== 'undefined' ? binding.toJS('studentWithHistory') : {},
				isPopupOpen 			= Boolean(binding.toJS('isPopupOpen')),
				globalBinding 			= this.getMoreartyContext().getBinding(),
				routingData 			= globalBinding.sub('routing.parameters').toJS(),
				studentWithoutHistoryId = routingData.studentId;
		
		return (
			<div>
				<div className="bStudentMerge">
					<p>{`You want merge`}</p>
					<p>{`${studentWithoutHistoryId}`}</p>
					<p>{`with`}</p>
					<p>
						<Autocomplete
							serviceFilter	= { this.serviceStudentsFilter}
							serverField		= 'name'
							onSelect		= { this.onSelectStudent }
							binding			= { binding.sub('_studentAutocomplete') }
							placeholder		= 'Student name'
						/>
					</p>
					<Button
						text 				= "Merge"
						onClick 			= { this.onClickMergeButton }
						extraStyleClasses 	= "eStudentMergeButton"
					/>
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
						Are you really sure?
					</ConfirmPopup>
				</If>
			</div>
		);
	}
});

module.exports = StudentWithoutPermissionMergeComponent;