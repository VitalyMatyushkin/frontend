const 	If 				= require('module/ui/if/if'),
		Autocomplete 	= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		React 			= require('react'),
		Immutable 		= require('immutable');

const PermissionAcceptPage = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		afterSubmitPage: React.PropTypes.string
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			_formAutocomplete: {},
			_houseAutocomplete: {},
			_studentAutocomplete: {},
			permissionId: null,
			comment: null,
			schoolId: null,
			formId: null,
			houseId: null,
			studentId: null
		});
	},
	componentWillMount: function() {
		var self = this,
			binding = self.getDefaultBinding(),
			globalBinding = self.getMoreartyContext().getBinding(),
			routingData = globalBinding.sub('routing.parameters').toJS(),
			permissionId = routingData.id;

		binding.clear();
		binding.set('permissionId', permissionId);

		if (permissionId) {
			window.Server.Permission.get(permissionId).then(function (data) {
				self.isMounted() && binding
										.atomically()
										.set('comment', data.comment)
										.set('schoolId', data.schoolId)
										.commit();
			});
		}
	},
	serviceFormFilter: function(fromName) {
		var self = this,
			binding = self.getDefaultBinding();

		return window.Server.schoolForms.get(binding.get('schoolId'), {
			filter: {
				where: {
					name: {
						like: fromName,
						options:'i'
					}
				}
			}
		});
	},
	onSelectForm: function(formId) {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('formId', formId);
	},
	serviceHouseFilter: function(houseName) {
		var self = this,
			binding = self.getDefaultBinding();

		return window.Server.schoolHouses.get(binding.get('schoolId'), {
			filter: {
				where: {
					name: {
						like: houseName,
						options:'i'
					}
				}
			}
		});
	},
	onSelectHouse: function(houseId) {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('houseId', houseId);
	},
	serviceStudentsFilter: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return window.Server.getAllStudents.get({
			filter: {
				where: {
					schoolId: binding.get('schoolId'),
					formId: binding.get('formId'),
					houseId: binding.get('houseId')
				},
				include: 'user'
			}
		}).then(function(students) {
			students.forEach(function(student) {
				student.name = student.user.firstName + " " + student.user.lastName;
			});
			return students;
		},function(error){console.log(error)});
	},
	onSelectStudent: function(studentId) {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('studentId', studentId);
	},
	onAcceptPermission: function() {
		var self = this,
			binding = self.getDefaultBinding();

		window.Server.Permission.put(
				{ id: binding.get('permissionId') },
				{ studentId: binding.get('studentId') }
			).then(function() {
				return window.Server.statusPermissionRequest.post(
						{ id: binding.get('permissionId')},
						{ accepted:true }
					);
			}).then(function(){
				document.location.hash = self.props.afterSubmitPage;
				return;
			});

	},
	render: function() {
		var self = this,
			binding = self.getDefaultBinding();

		return (
			<div className='bForm'>
				<h2>Accept parent permission. Please choose student.</h2>
				<h3>{binding.get('comment')}</h3>
				<div className='eForm_field'>
					<Autocomplete
						serviceFilter={self.serviceFormFilter}
						serverField='name'
						onSelect={self.onSelectForm}
						binding={binding.sub('_formAutocomplete')}
						placeholderText='form name'
					/>
				</div>
				<If condition={binding.get('formId') !== undefined}>
					<div className='eForm_field'>
						<Autocomplete
							serviceFilter={self.serviceHouseFilter}
							serverField='name'
							onSelect={self.onSelectHouse}
							binding={binding.sub('_houseAutocomplete')}
							placeholderText='house name'
						/>
					</div>
				</If>
				<If condition={binding.get('formId') !== undefined && binding.get('houseId') !== undefined}>
					<div className='eForm_field'>
						<Autocomplete
							serviceFilter={self.serviceStudentsFilter}
							serverField='name'
							onSelect={self.onSelectStudent}
							binding={binding.sub('_studentAutocomplete')}
							placeholderText='Student name'
						/>
					</div>
				</If>
				<If condition={binding.get('formId') !== undefined && binding.get('houseId') !== undefined && binding.get('studentId') !== undefined}>
					<div className="bButton" onClick={self.onAcceptPermission}>Accept permission</div>
				</If>
			</div>
		)
	}
});

module.exports = PermissionAcceptPage;