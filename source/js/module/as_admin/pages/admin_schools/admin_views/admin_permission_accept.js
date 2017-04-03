const	If 				= require('module/ui/if/if'),
		Autocomplete 	= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		React			= require('react'),
		Lazy			= require('lazy.js'),
		Morearty   	 	= require('morearty'),
		Immutable		= require('immutable');

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
			prId = routingData.prId,
            schoolId = routingData.schoolId;

		binding.clear();
        binding.set('prId', prId);
        binding.set('schoolId', schoolId);

		if (prId) {
			window.Server.permissionRequest.get({prId:prId, schoolId:schoolId}).then(function (data) {
				binding
					.atomically()
					.set('comment', data.requestedPermission.comment)
					.commit();
			});
		}
	},
	serviceFormFilter: function(fromName) {
		var self = this,
			binding = self.getDefaultBinding(),
            schoolId = binding.get('schoolId');

		return window.Server.schoolForms.get(schoolId, {
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
			binding = self.getDefaultBinding(),
            schoolId = binding.get('schoolId');

		return window.Server.schoolHouses.get(schoolId, {
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
	serviceStudentsFilter: function(lastName) {
		const	self	= this,
				binding	= self.getDefaultBinding(),
				formIdArray = [binding.get('formId')],
				houseIdArray = [binding.get('houseId')];
		let filter;
		if (lastName === '') {
			filter = {
				limit: 100,
				where: {
					formId: {
						$in: formIdArray
					},
					houseId: {
						$in: houseIdArray
					}
				}
			}
		} else {
			filter = {
				limit: 100,
				where: {
					formId: {
						$in: formIdArray
					},
					houseId: {
						$in: houseIdArray
					},
					$or: [
						{
							firstName: {
								like: lastName,
								options: 'i'
							}
						},
						{
							lastName: {
								like: lastName,
								options: 'i'
							}
						}
					]
				}
			}
		}
		return window.Server.schoolStudents.get(binding.get('schoolId'),{
			filter: filter
		})
		.then(
			students => {
				students.forEach(student => {
					student.name = student.firstName + " " + student.lastName;
				});

				return students;
			},
			error => {
				console.log(error);
			}
		);
	},
	onSelectStudent: function(studentId) {
		var self = this,
			binding = self.getDefaultBinding();

		binding.set('studentId', studentId);
	},
	onAcceptPermission: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            prId = binding.get('prId'),
            schoolId = binding.get('schoolId'),
            studentId = binding.get('studentId');

        window.Server.statusPermissionRequest.put({schoolId:schoolId, prId:prId},{status:'ACCEPTED', studentId:studentId})
            .then(function(){
				document.location.hash = self.props.afterSubmitPage;
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
						placeholder='form name'
					/>
				</div>
				<If condition={binding.get('formId') !== undefined}>
					<div className='eForm_field'>
						<Autocomplete
							serviceFilter={self.serviceHouseFilter}
							serverField='name'
							onSelect={self.onSelectHouse}
							binding={binding.sub('_houseAutocomplete')}
							placeholder='house name'
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
							placeholder='Student name'
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