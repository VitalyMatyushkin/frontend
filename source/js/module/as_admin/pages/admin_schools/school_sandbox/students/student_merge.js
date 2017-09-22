/**
 * Created by Woland on 22.09.2017.
 */
const 	React 			= require('react'),
		Morearty 		= require('morearty'),
		Immutable 		= require('immutable'),
		Autocomplete 	= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		Button 			= require('module/ui/button/button');

const StudentMergeComponentStyles = require('styles/pages/schools/b_school_student_merge.scss');

const StudentMergeComponent = React.createClass({
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
	serviceStudentsFilter: function(name) {
		const 	binding = this.getDefaultBinding(),
				globalBinding = this.getMoreartyContext().getBinding(),
				schoolId = globalBinding.get('routing.pathParameters.0');
		
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

		binding.set('studentWithoutHistoryId', studentId);
	},
	onClickMergeButton: function(){
		const 	binding 				= this.getDefaultBinding(),
				studentWithoutHistoryId = binding.toJS('studentWithoutHistoryId'),
				globalBinding 			= this.getMoreartyContext().getBinding(),
				schoolId 				= globalBinding.get('routing.pathParameters.0'),
				studentWithHistoryId 	= globalBinding.get('routing.pathParameters.3');
		
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
		const 	binding 			= this.getDefaultBinding(),
				studentWithHistory 	= binding.toJS('studentWithHistory'),
				isSync 				= Boolean(binding.toJS('isSync'));
		
		if (isSync) {
			return (
				<div className="bStudentMerge">
					<p>{`You want merge`}</p>
					<p>{`${studentWithHistory.firstName} ${studentWithHistory.lastName}`}</p>
					<p>{`with`}</p>
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
					/>
				</div>
			);
		} else {
			return null;
		}

	}
});

module.exports = StudentMergeComponent;