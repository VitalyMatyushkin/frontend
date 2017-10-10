/**
 * Created by Woland on 27.09.2017.
 */
const 	React 			= require('react'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable');

const 	Autocomplete 	= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		If 				= require('module/ui/if/if'),
		Popup 			= require('module/ui/new_popup'),
		Button 			= require('module/ui/button/button');

const StudentImporter = require('module/utils/student_importer');

const ActivateStudentsComponent = React.createClass({
	mixins: [Morearty.Mixin],
	componentWillUnmount:function(){
		const binding = this.getDefaultBinding();
		
		binding.clear();
	},
	onSchoolChange: function (schoolId){
		const 	binding	= this.getDefaultBinding();
		binding.set('schoolId', Immutable.fromJS(schoolId));
	},
	onChangeFile: function (event){
		const 	binding	= this.getDefaultBinding(),
				file	= event.target.files[0];
		
		const config = {
			header: true,
			skipEmptyLines: true
		};
		
		StudentImporter.parseCSVFile(file, config).then(
			result => {
				binding.set('studentData', Immutable.fromJS(result));
			},
			err => { console.log('err: ' + err.message + '\n' + err.stack) }
		);
	},
	serviceSchoolFilter: function(schoolName) {
		return window.Server.schools.get({
			filter: {
				where: {
					name: {
						like: schoolName,
						options:'i'
					}
				}
			}
		});
	},
	handleUploadStudentsButtonClick: function(){
		const 	binding			= this.getDefaultBinding(),
				studentData 	= binding.toJS('studentData'),
				schoolId 		= binding.toJS('schoolId');
		
		const studentsIdsAndEmails = studentData.data;
		
		window.Server.activateStudents.post({schoolId: schoolId}, {students: studentsIdsAndEmails}).then(
			response => {
				binding
					.atomically()
					.set('activateStudentsData', Immutable.fromJS(response))
					.set('isPopupOpen', true)
					.commit();
				
			},
			err => {
				window.simpleAlert(
					`Something went wrong. Please show error text to your system administrator: \n${err}`,
					'Ok',
					() => {}
				);
			}
		);
	},
	validationEverything: function (){
		const 	binding			= this.getDefaultBinding(),
				studentData 	= binding.toJS('studentData'),
				schoolId 		= binding.toJS('schoolId');
		
		if (typeof studentData !== 'undefined' && typeof schoolId !== 'undefined'){
			
			const	errorsParse 			= studentData.errors,
					studentsIdsAndEmails 	= studentData.data;
			
			let errorsList = [],
				numberError = 0;
			
			for (let key in errorsParse) {
				numberError++;
				errorsList.push(
					<li key = { numberError }>
						Row: 		{ errorsParse[key].row }
						Message: 	{ errorsParse[key].message }
					</li>
				);
			}
			
			if (errorsList.length > 0) {
				return (
					<div>
						<Button
							text 	= "Activate students"
							onClick	= { this.handleUploadStudentsButtonClick }
						/>
						<p>Students to activate {studentsIdsAndEmails.length}</p>
						<p>Errors: {numberError} </p>
						<ul>{errorsList}</ul>
					</div>
				)
			}
			else {
				return  (
					<div>
						<Button
							text 	= "Activate students"
							onClick	= { this.handleUploadStudentsButtonClick }
						/>
						<p>Students to activate {studentsIdsAndEmails.length}</p>
					</div>
				)
			}
			
		}
		else {
			return <p>No data to upload</p>
		}
	},
	onClickOkPopup: function(){
		const binding = this.getDefaultBinding();
		
		binding.set('isPopupOpen', false);
	},
	renderStudentData: function(){
		const 	binding 				= this.getDefaultBinding(),
				activateStudentsData 	= binding.toJS('activateStudentsData');
		
		const 	domain 		= document.location.host.replace('admin', 'password'),
				protocol 	= document.location.href.split('/')[0];
		
		if (Array.isArray(activateStudentsData)) {
			return activateStudentsData.map((activeStudent, index) => {
				return (
					<div key={index}>
						<p key={"studentId-" + index}>Student id: {activeStudent.id}</p>
						<p key={"studentEmail-" + index}>Student email: {activeStudent.email}</p>
						<p key={"studentToken-" + index}>Student token: {activeStudent.token}</p>
						<p key={"studentUrl-" + index}>{`Student url: ${protocol}//${domain}/#reset?secretKey=${activeStudent.token}`}</p>
					</div>
				);
			});
		} else {
			return null;
		}
	},
	render: function(){
		const 	binding 				= this.getDefaultBinding(),
				isSchoolId 				= Boolean(binding.toJS('schoolId')),
				isPopupOpen 			= Boolean(binding.toJS('isPopupOpen'));

		return (
			<div className = 'bForm mNarrow'>
				<h3>Pls, choose school</h3>
				<div className = 'eForm_field'>
					<Autocomplete
						serviceFilter 	= { this.serviceSchoolFilter }
						serverField 	= 'name'
						onSelect 		= { this.onSchoolChange }
						placeholder 	= 'School Name'
					/>
				</div>
				<If condition = {isSchoolId}>
					<div>
						<div className='eForm_field'>
							<input
								id 			= "files"
								type 		= "file"
								name 		= "files[]"
								onChange 	= { this.onChangeFile }
							/>
						</div>
						<div>{this.validationEverything()}</div>
					</div>
				</If>
				<Popup
					isOpened 				= { isPopupOpen }
					handleClickCloseButton 	= { this.onClickOkPopup }
					isShowCloseButton 		= { true }
				>
					<span className="eInviteLinkPopup">{this.renderStudentData()}</span>
				</Popup>
			</div>
		)
	}
});

module.exports = ActivateStudentsComponent;