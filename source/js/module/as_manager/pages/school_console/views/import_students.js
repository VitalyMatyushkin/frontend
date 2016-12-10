const	React 				= require('react'),
	Promise					= require('bluebird'),
	Morearty				= require('morearty'),
	Immutable				= require('immutable'),
	moment					= require('moment'),
	MoreartyHelper			= require('./../../../../helpers/morearty_helper'),
	StudentImporter			= require('module/utils/student_importer');

const ImportStudents = React.createClass({
	mixins: [Morearty.Mixin],
	componentDidMount: function() {
		const	binding	= this.getDefaultBinding();
		this.activeSchoolId = MoreartyHelper.getActiveSchoolId(this);
		binding.remove('studentData');
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
			studentData = binding.toJS('studentData');

		if (typeof studentData !== 'undefined'){
			const errorsImport = binding.toJS('studentData.errors'),
				studentsImport = binding.toJS('studentData.students');

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
		const	studentData		= binding.toJS('studentData');

		Promise.all(studentData.students.map( student => {
			return window.Server.schoolStudents.post(this.activeSchoolId, {
				firstName:	student.firstName,
				lastName:	student.lastName,
				gender:		student.gender,
				birthday:	this.getBirthdayInServerFormat(student.birthday),
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

	render: function() {
		const	self	= this,
			binding	= self.getDefaultBinding();

		return (
			<div className='bForm'>
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

module.exports = ImportStudents;