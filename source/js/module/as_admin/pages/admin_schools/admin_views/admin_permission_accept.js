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
		const 	binding 		= this.getDefaultBinding(),
				globalBinding 	= this.getMoreartyContext().getBinding(),
				routingData 	= globalBinding.sub('routing.parameters').toJS(),
				prId 			= routingData.prId,
				schoolId 		= routingData.schoolId;

		binding.clear();
		binding.set('prId', prId);
		binding.set('schoolId', schoolId);

		if (prId) {
			window.Server.permissionRequest.get({prId:prId, schoolId:schoolId}).then( data => {
				binding
					.atomically()
					.set('comment', data.requestedPermission.comment)
					.commit();
			});
		}
	},
	serviceFormFilter: function(fromName) {
		const 	binding 	= this.getDefaultBinding(),
				schoolId 	= binding.get('schoolId');

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
		const binding = this.getDefaultBinding();

		binding.set('formId', formId);
	},
	serviceHouseFilter: function(houseName) {
		const 	binding 	= this.getDefaultBinding(),
				schoolId 	= binding.get('schoolId');

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
		const binding = this.getDefaultBinding();

		binding.set('houseId', houseId);
	},
	serviceStudentsFilter: function(name) {
		const	binding	= this.getDefaultBinding(),
				formIdArray = [binding.get('formId')],
				houseIdArray = [binding.get('houseId')];
		
		let filter;
		
		if (name === '') {
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
				console.error(error);
			}
		);
	},
	onSelectStudent: function(studentId) {
		const binding = this.getDefaultBinding();

		binding.set('studentId', studentId);
	},
	onAcceptPermission: function() {
		const 	binding 	= this.getDefaultBinding(),
				prId 		= binding.get('prId'),
				schoolId 	= binding.get('schoolId'),
				studentId 	= binding.get('studentId');

		window.Server.statusPermissionRequest.put({schoolId:schoolId, prId:prId},{status:'ACCEPTED', studentId:studentId})
			.then( () => {
				document.location.hash = this.props.afterSubmitPage;
			});
	},
	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<div className='bForm'>
				<div className="eForm_atCenter">
					<h2>Accept parent permission. Please choose student.</h2>
					<h3>Comment from parent: {binding.get('comment')}</h3>
					<div className='eForm_field'>
						<Autocomplete
							serviceFilter={this.serviceFormFilter}
							serverField='name'
							onSelect={this.onSelectForm}
							binding={binding.sub('_formAutocomplete')}
							placeholder='form name'
						/>
					</div>
					<If condition={binding.get('formId') !== undefined}>
						<div className='eForm_field'>
							<Autocomplete
								serviceFilter={this.serviceHouseFilter}
								serverField='name'
								onSelect={this.onSelectHouse}
								binding={binding.sub('_houseAutocomplete')}
								placeholder='house name'
							/>
						</div>
					</If>
					<If condition={binding.get('formId') !== undefined && binding.get('houseId') !== undefined}>
						<div className='eForm_field'>
							<Autocomplete
								serviceFilter={this.serviceStudentsFilter}
								serverField='name'
								onSelect={this.onSelectStudent}
								binding={binding.sub('_studentAutocomplete')}
								placeholder='Student name'
							/>
						</div>
					</If>
					<If condition={binding.get('formId') !== undefined && binding.get('houseId') !== undefined && binding.get('studentId') !== undefined}>
						<div className="bButton" onClick={this.onAcceptPermission}>Accept permission</div>
					</If>
				</div>
			</div>
		)
	}
});

module.exports = PermissionAcceptPage;