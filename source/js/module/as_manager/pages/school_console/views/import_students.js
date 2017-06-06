const	React 				= require('react'),
	Promise					= require('bluebird'),
	Morearty				= require('morearty'),
	Immutable				= require('immutable'),
	moment					= require('moment'),
	MoreartyHelper			= require('./../../../../helpers/morearty_helper'),
	Loader 					= require('module/ui/loader'),
	StudentImporter			= require('module/utils/student_importer');

const ImportStudents = React.createClass({
	mixins: [Morearty.Mixin],
	componentDidMount: function() {
		const	binding	= this.getDefaultBinding(),
			activeSchoolId = MoreartyHelper.getActiveSchoolId(this);

		let school = {};
		binding.set('importIsSync', Immutable.fromJS(false));
		binding.remove('studentData');
		binding.remove('activeSchool');

		window.Server.schoolForms.get({schoolId: activeSchoolId})
			.then(forms => {
				school.forms = forms;
				return window.Server.schoolHouses.get({schoolId: activeSchoolId})
			})
			.then(houses => {
				school.houses = houses;
				binding.set('activeSchool', Immutable.fromJS(school));
			});
	},

	onChangeFile: function (event){
		const 	binding	= this.getDefaultBinding(),
			file	= event.target.files[0],
			activeSchool = binding.toJS('activeSchool');

		StudentImporter.loadFromCSV(file).then(
			result => {
				binding.set('studentData', Immutable.fromJS(result));
				const formsAndHouses = StudentImporter.pullFormsAndHouses(result, activeSchool);
				binding.set('studentData', Immutable.fromJS(formsAndHouses));

				this.validationEverything();
			},
			err => { console.error('err: ' + err.message + '\n' + err.stack) }
		);
	},

	validationEverything: function (){
		const 	binding	= this.getDefaultBinding(),
			studentData = binding.toJS('studentData');

		if (typeof studentData !== 'undefined'){
			const errorsImport = binding.toJS('studentData.errors'),
				studentsImport = binding.toJS('studentData.students');

			let errorsList = [],
				numberError = 0;

			for (let key in errorsImport) {
				numberError++;
				/**
				 * In console React has error with unique key in elements li
				 */
				errorsList.push(<li>Row: {errorsImport[key].row} Message: {errorsImport[key].message}</li>);
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
		const binding = this.getDefaultBinding(),
			studentData = binding.toJS('studentData'),
			activeSchoolId = MoreartyHelper.getActiveSchoolId(this);
		binding.remove('importIsSync');
		Promise.all(studentData.students.map( student => {
			return window.Server.schoolStudents.post(activeSchoolId, {
				firstName:	student.firstName,
				lastName:	student.lastName,
				gender:		student.gender,
				formId: 	student.formId,
				houseId: 	student.houseId,
				birthday:	this.getBirthdayInServerFormat(student.birthday)
			});
		})).then(() => {
			binding.set('importIsSync', Immutable.fromJS(false));
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

	render: function() {
		const binding = this.getDefaultBinding(),
			isSync = binding.toJS('importIsSync');

		return (
			<div className='bForm'>
				<Loader condition={isSync} />
				<div className='eForm_field'>
					<input
						id="files"
						type="file"
						name="files[]"
						onChange={this.onChangeFile}
					/>
				</div>
				<div>{this.validationEverything()}</div>
			</div>

		)
	}

});

module.exports = ImportStudents;