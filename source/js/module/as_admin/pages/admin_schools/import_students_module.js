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
			studentsList: [],
			_schoolAutocomplete: {}
		});
	},
	_getBirthdayInServerFormat: function(birthday) {
		return moment(birthday, 'DD-MM-YYYY').format('YYYY-MM-DD');
		// return `${birthday.substring(6,10)}-${birthday.substring(3,5)}-${birthday.substring(0,2)}`;
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
	/**
	 * If file change - upload file, parse students list and set it to state
	 * @param evt
	 * @private
	 */
	_handleChange: function(evt) {
		const 	binding	= this.getDefaultBinding(),
				file	= evt.target.files[0];

		StudentImporter(file).then(
			result => {
				console.log('Data: ' + JSON.stringify(result, null, 2));
				binding.set('studentsList', Immutable.fromJS(result.students));
			},
			err => { console.log('err: ' + err.message + '\n' + err.stack) }
		);

	},
	_handleUploadStudentsButtonClick: function() {
		const	self = this,
				binding	= self.getDefaultBinding();

		const	currentSchool	= binding.toJS('currentSchool'),
				studentsList	= binding.toJS('studentsList');

		Promise.all(studentsList.map(student => {
				const	form	= Lazy(currentSchool.forms).findWhere({name: student.form}),
						house	= Lazy(currentSchool.houses).findWhere({name: student.house});

				let	formId,
					houseId;

				form && (formId = form.id);
				house && (houseId = house.id);

				if(formId && houseId) {
					return window.Server.schoolStudents.post(currentSchool.id, {
						firstName:	student.firstName,
						lastName:	student.lastName,
						gender:		student.gender,
						birthday:	self._getBirthdayInServerFormat(student.birthday),
						formId: 	formId,
						houseId: 	houseId
					});
				} else {
					return {};
				}
			}))
			.then(() => {
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
				binding	= self.getDefaultBinding();

		let button;

		if(binding.toJS('studentsList').length !== 0 && binding.get('currentSchool')) {
			button = (
				<div className="bButton" onClick={self._handleUploadStudentsButtonClick}>
					Upload students
				</div>
			);
		}

		return button
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
			</div>
		)
	}
});

module.exports = ImportStudentsModule;