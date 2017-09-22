const	React 			= require('react'),
		Autocomplete	= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		Loader 			= require('module/ui/loader'),
		Promise			= require('bluebird'),
		Morearty		= require('morearty'),
		Immutable		= require('immutable'),
		moment			= require('moment'),
		StudentImporter	= require('module/utils/student_importer');

const ImportStudentsModule = React.createClass({
	mixins: [Morearty.Mixin],
	componentDidMount: function() {
		const	binding	= this.getDefaultBinding();

		binding.remove('studentData');
		binding.remove('currentSchool');
		binding.set('importIsSync', Immutable.fromJS('false'));
	},

	onSchoolChange: function (schoolId, school){
		const binding	= this.getDefaultBinding();

		binding.remove('importIsSync');
		window.Server.schoolForms.get({schoolId: schoolId}, {filter: {limit: 100}})
			.then(forms => {
				school.forms = forms;
				return window.Server.schoolHouses.get({schoolId: schoolId}, {filter: {limit: 100}})
			})
			.then(houses => {
				school.houses = houses;
				binding.set('currentSchool', Immutable.fromJS(school));
				binding.set('importIsSync', Immutable.fromJS('false'));
			});
	},

	onChangeFile: function (event){
		const 	binding	= this.getDefaultBinding(),
				file	= event.target.files[0];

		StudentImporter.loadFromCSV(file).then(
			result => {
				binding.set('studentData', Immutable.fromJS(result));
			},
			err => { console.log('err: ' + err.message + '\n' + err.stack) }
		);
	},

	validationEverything: function (){
		const 	binding	= this.getDefaultBinding(),
				studentData = binding.toJS('studentData'),
				currentSchool = binding.toJS('currentSchool');

		if (typeof studentData !== 'undefined' && typeof currentSchool !== 'undefined'){
			const 	result			= StudentImporter.pullFormsAndHouses(studentData, currentSchool);

            binding.set('studentDataResult', Immutable.fromJS(result));

			const	errorsImport	= result.errors,
					studentsImport	= result.students;

			let errorsList = [],
					numberError = 0;

			for (let key in errorsImport) {
				numberError++;
				errorsList.push(<li>Row: {errorsImport[key].row} Message: {errorsImport[key].message}</li>); //In console React has error with unique key in elements li
			}

			if (errorsList.length > 0) {
					return (
						<div>
						<div className="bButton" onClick={this.handleUploadStudentsButtonClick}>
							Upload students
						</div>
							<p>Students to upload {studentsImport.length}</p>
							<p>Errors: {numberError} </p>
							<ul>{errorsList}</ul>
						</div>
					)
			}
			else {
				return  (
					<div>
						<div className="bButton" onClick={this.handleUploadStudentsButtonClick}>
							Upload students
						</div>
						<p>Students to upload {studentsImport.length}</p>
					</div>
				)
			}

		}
		else {
			return <p>No data to upload</p>
		}
	},

	handleUploadStudentsButtonClick: function() {
		const	binding	= this.getDefaultBinding();

		const	currentSchool	= binding.toJS('currentSchool'),
				studentData		= binding.toJS('studentDataResult');

		Promise.all(studentData.students.map( student => {
			return window.Server.schoolStudents.post(currentSchool.id, {
				firstName:	student.firstName,
				lastName:	student.lastName,
				gender:		student.gender,
				birthday:	student.birthday ? this.getBirthdayInServerFormat(student.birthday) : undefined,
				formId: 	student.formId,
				houseId: 	student.houseId
			});
		})).then(() => {
			window.simpleAlert(
				'Students upload was finished',
				'Ok',
				() => {}
			);
		})
		.catch(error => {
			window.simpleAlert(
				`Something went wrong. Please show error text to your system administrator: \n${error}`,
				'Ok',
				() => {}
			);
		});
	},	
	
	getBirthdayInServerFormat: function(birthday) {
		return moment(birthday, 'DD-MM-YYYY').format('YYYY-MM-DD');
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

	render: function() {
			const	self	= this,
					binding	= self.getDefaultBinding(),
					importIsSync = binding.toJS('importIsSync');

			return (
				<div className='bForm mNarrow'>
					<h3>Pls, choose school</h3>
					<div className='eForm_field'>
						<Autocomplete
							serviceFilter={self.serviceSchoolFilter}
							serverField='name'
							onSelect={self.onSchoolChange}
							placeholder='School Name'
						/>
					</div>
					<div className='eForm_field'>
						<input
							id="files"
							type="file"
							name="files[]"
							onChange={self.onChangeFile}
						/>
					</div>
					<Loader condition={!importIsSync} />
					<div>{self.validationEverything()}</div>
				</div>
			)
		}

});

module.exports = ImportStudentsModule;