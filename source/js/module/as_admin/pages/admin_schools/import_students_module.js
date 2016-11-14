/**
const	React 			= require('react'),
		Autocomplete	= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		Promise			= require('bluebird'),
		Lazy			= require('lazy.js'),
		Morearty    	= require('morearty'),
		Immutable		= require('immutable'),
		moment			= require('moment'),
		StudentImporter	= require('module/utils/student_importer');

const ImportStudentsModule = React.createClass({
	mixins: [Morearty.Mixin],
	getDefaultState: function () {
		return Immutable.fromJS({
			currentSchool: undefined,
			_schoolAutocomplete: {}
		});
	},
	componentDidMount() {
		const	binding	= this.getDefaultBinding();
		binding.set('studentData', Immutable.fromJS({}));
  },
	_getBirthdayInServerFormat: function(birthday) {
		return moment(birthday, 'DD-MM-YYYY').format('YYYY-MM-DD');
	},
	_serviceSchoolFilter: function(schoolName) {
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
	_onSelectSchool: function(schoolId, school) {
		const	self	= this,
				binding	= self.getDefaultBinding();

		window.Server.schoolForms.get({schoolId: schoolId})
			.then(forms => {
				school.forms = forms;
				return window.Server.schoolHouses.get({schoolId: schoolId})
			})
			.then(houses => {
				school.houses = houses;
				binding.set('currentSchool', Immutable.fromJS(school));
			});
	},
	*/
	/**
	 * If file change - upload file, parse students list and set it to state
	 * @param evt
	 * @private
	 */
	 /*
	_handleChange: function(evt) {
		const 	binding	= this.getDefaultBinding(),
				file	= evt.target.files[0];

		StudentImporter.loadFromCSV(file).then(
			result => {
				binding.set('studentData', Immutable.fromJS(result));
			},
			err => { console.log('err: ' + err.message + '\n' + err.stack) }
		);

	},
	_handleUploadStudentsButtonClick: function() {
		const	self	= this,
				binding	= self.getDefaultBinding();

		const	currentSchool	= binding.toJS('currentSchool'),
				studentData		= binding.toJS('studentData');

		const result = StudentImporter.pullFormsAndHouses(studentData, currentSchool);
		Promise.all(result.students.map( student => {
			return window.Server.schoolStudents.post(currentSchool.id, {
				firstName:	student.firstName,
				lastName:	student.lastName,
				gender:		student.gender,
				birthday:	self._getBirthdayInServerFormat(student.birthday),
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
	_renderUploadStudentsButton: function() {
		const	self	= this,
				binding	= self.getDefaultBinding(),
				dataStudents = binding.toJS('studentData.students');
		let button;
		if (typeof dataStudents !== 'undefined'){
			if(dataStudents.length !== 0 && binding.get('currentSchool')) {
				button = (
					<div className="bButton" onClick={self._handleUploadStudentsButtonClick}>
						Upload students
					</div>
				);
			}
		}
		return button
	},	
	_getLengthDataStudents: function(){
		const binding	= this.getDefaultBinding(),
				dataStudents = binding.toJS('studentData.students');
		if (typeof dataStudents !== 'undefined'){
				return dataStudents.length
		}
		else {
			return 0
		}
	},
	_showErrors: function () {
			const binding	= this.getDefaultBinding(),
					errorsImport = binding.toJS('studentData.errors');					
			let errorsList = [],
				numberError = 0;
			if (typeof errorsImport !== 'undefined'){
				for (let key in errorsImport) {	
					numberError++;		
					errorsList.push(<li>Row: {errorsImport[key].row} Message: {errorsImport[key].message}</li>); //In console React has error with unique key in elements li			
				};
				if (errorsList.length > 0) {
					return (
										<div>
											<p>Errors: {numberError} </p>
											<ul>{errorsList}</ul>
										</div>
						);
				}
				else {
					return <p>Not Errors</p>;
				};
			};
		},	
	render: function() {
		const	self	= this,								
				binding	= self.getDefaultBinding();

		return (
			
			<div className='bForm'>
				<h3>Pls, choose school</h3>
				<div className='eForm_field'>
					<Autocomplete
						serviceFilter={self._serviceSchoolFilter}
						serverField='name'
						onSelect={self._onSelectSchool}
						binding={binding.sub('_schoolAutocomplete')}
						placeholderText='School Name'
					/>
				</div>
				<div className='eForm_field'>
					<input
						id="files"
						type="file"
						name="files[]"
						onChange={self._handleChange}
					/>
				</div>
				{self._renderUploadStudentsButton()}
				<div className='eForm_info'>Students to upload: {this._getLengthDataStudents()}</div>
				<div className='eForm_warning'>{this._showErrors()}</div>
			</div>
		)
	}
});

module.exports = ImportStudentsModule;*/


const	React 				= require('react'),
		Autocomplete		= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		Promise					= require('bluebird'),
		Morearty    		= require('morearty'),
		Immutable				= require('immutable'),
		moment					= require('moment'),
		StudentImporter	= require('module/utils/student_importer');

const ImportStudentsModule = React.createClass({
		mixins: [Morearty.Mixin],

	componentDidMount() {
		const	binding	= this.getDefaultBinding();

		binding.remove('studentData');
		binding.remove('currentSchool');
  },		

	onSchoolChange: function (schoolId, school){
		const	binding	= this.getDefaultBinding();

			window.Server.schoolForms.get({schoolId: schoolId})
				.then(forms => {
					school.forms = forms;
					return window.Server.schoolHouses.get({schoolId: schoolId})
				})
				.then(houses => {
					school.houses = houses;
					binding.set('currentSchool', Immutable.fromJS(school));
					this.validationEverything();
				});	
	},

	onChangeFile: function (event){
		const 	binding	= this.getDefaultBinding(),
						file	= event.target.files[0];

			StudentImporter.loadFromCSV(file).then(
				result => {
					binding.set('studentData', Immutable.fromJS(result));
					this.validationEverything();
				},
				err => { console.log('err: ' + err.message + '\n' + err.stack) }
			);	
	},

	validationEverything: function (){
		const 	binding	= this.getDefaultBinding(),
				studentData = binding.toJS('studentData'),				
				currentSchool = binding.toJS('currentSchool');

		if (typeof studentData !== 'undefined' && typeof currentSchool !== 'undefined'){
			const result = StudentImporter.pullFormsAndHouses(studentData, currentSchool),
					errorsImport = binding.toJS('studentData.errors'),							
					studentsImport = binding.toJS('studentData.students'),
					errorsFormId = result.errors;

			let errorsList = [],
					numberError = 0;

			for (let key in errorsImport) {	
				numberError++;		
				errorsList.push(<li>Row: {errorsImport[key].row} Message: {errorsImport[key].message}</li>); //In console React has error with unique key in elements li			
			};
			for (let key in errorsFormId) {	
				numberError++;		
				errorsList.push(<li>Row: {errorsFormId[key].row} Message: {errorsFormId[key].message}</li>); //In console React has error with unique key in elements li			
			};			

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
			};

		}		
		else {
			return <p>No data to upload</p>
		}
	},

	handleUploadStudentsButtonClick: function() {
		const	binding	= self.getDefaultBinding();

		const	currentSchool	= binding.toJS('currentSchool'),
				studentData		= binding.toJS('studentData');
		
		Promise.all(result.students.map( student => {
			return window.Server.schoolStudents.post(currentSchool.id, {
				firstName:	student.firstName,
				lastName:	student.lastName,
				gender:		student.gender,
				birthday:	self.getBirthdayInServerFormat(student.birthday),
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
					binding	= self.getDefaultBinding();

			return (			
				<div className='bForm'>
					<h3>Pls, choose school</h3>
					<div className='eForm_field'>
						<Autocomplete
							serviceFilter={self.serviceSchoolFilter}
							serverField='name'
							onSelect={self.onSchoolChange}
							binding={binding.sub('schoolAutocomplete')}
							placeholderText='School Name'
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
					<div>{self.validationEverything()}</div>					
				</div>
				
			)
		}

});

module.exports = ImportStudentsModule;