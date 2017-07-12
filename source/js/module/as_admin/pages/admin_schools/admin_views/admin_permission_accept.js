const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		If 					= require('module/ui/if/if'),
		Autocomplete 		= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		SquareCrossButton	= require('module/ui/square_cross_button');

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
		const	binding			= this.getDefaultBinding();

		const	globalBinding	= this.getMoreartyContext().getBinding(),
				routingData		= globalBinding.sub('routing.parameters').toJS(),
				prId			= routingData.prId,
				schoolId		= routingData.schoolId;

		binding.clear();

		// It's auto generated key for house input.
		// It exists because we must have opportunity to reset state of this component by hand.
		binding.set('houseInputKey', Immutable.fromJS(this.generatePostcodeInputKey()));
		binding.set('prId', prId);
		binding.set('schoolId', schoolId);

		if (prId) {
			window.Server.permissionRequest.get(
				{
					prId:		prId,
					schoolId:	schoolId
				}
			)
			.then(data => {
				binding.set('comment', data.requestedPermission.comment);
			});
		}
	},
	generatePostcodeInputKey: function() {
		// just current date in timestamp view
		return + new Date();
	},
	getHouseIds: function() {
		const binding = this.getDefaultBinding();

		const houseIds = [];

		const houseId = binding.get('houseId');
		if(typeof houseId !== 'undefined') {
			houseIds.push(houseId);
		}

		return houseIds;
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
		const 	binding		= this.getDefaultBinding(),
				schoolId	= binding.get('schoolId');

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
		const	binding		= this.getDefaultBinding();

		const	formIdArray	= [binding.get('formId')];
		let		filter;
		
		if (name === '') {
			filter = {
				limit: 100,
				where: {
					formId: {
						$in: formIdArray
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

		// house Id is optional so it can be empty array
		const houseIdArray = this.getHouseIds();
		if(houseIdArray.length !== 0) {
			filter.where.houseId = { $in: houseIdArray };
		}

		return window.Server.schoolStudents.get(
			binding.get('schoolId'),
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

		binding.set('studentId', studentId);
	},
	onAcceptPermission: function() {
		const	binding		= this.getDefaultBinding();

		const	prId		= binding.get('prId'),
				schoolId	= binding.get('schoolId'),
				studentId	= binding.get('studentId');

		window.Server.statusPermissionRequest.put(
			{ schoolId:schoolId, prId:prId },
			{ status:'ACCEPTED', studentId:studentId }
		)
		.then(() => {
			document.location.hash = this.props.afterSubmitPage;
		});
	},
	onClickDeselectHouse: function() {
		const binding = this.getDefaultBinding();

		binding.set('houseId', undefined);
		binding.set('houseInputKey', Immutable.fromJS(this.generatePostcodeInputKey()));
	},
	render: function() {
		const binding = this.getDefaultBinding();

		const comment = binding.get('comment');

		return (
			<div className='bForm'>
				<div className="eForm_atCenter">

					<h2>Accept parent permission. Please choose student.</h2>

					<h3>Comment from parent: {comment}</h3>

					<div className='eForm_field'>
						<Autocomplete
							serviceFilter	= { this.serviceFormFilter }
							serverField		= 'name'
							onSelect		= { this.onSelectForm }
							binding			= { binding.sub('_formAutocomplete') }
							placeholder		= 'form name'
						/>
					</div>

					<If condition={typeof binding.get('formId') !== 'undefined'}>
						<div className='eForm_field'>
							<Autocomplete
								key				= { binding.toJS('houseInputKey') }
								serviceFilter	= { this.serviceHouseFilter }
								serverField		= 'name'
								onSelect		= { this.onSelectHouse}
								binding			= { binding.sub('_houseAutocomplete') }
								placeholder		= 'house name'
								extraCssStyle	= { 'mWidth350 mInline mRightMargin' }
							/>
							<SquareCrossButton
								handleClick={this.onClickDeselectHouse}
							/>
						</div>
					</If>

					<If condition={typeof binding.get('formId') !== 'undefined'}>
						<div className='eForm_field'>
							<Autocomplete
								serviceFilter	= { this.serviceStudentsFilter}
								serverField		= 'name'
								onSelect		= { this.onSelectStudent }
								binding			= { binding.sub('_studentAutocomplete') }
								placeholder		= 'Student name'
							/>
						</div>
					</If>

					<If condition={typeof binding.get('formId') !== 'undefined' && typeof binding.get('studentId') !== 'undefined'}>
						<div
							className	= "bButton"
							onClick		= { this.onAcceptPermission }
						>
							Accept permission
						</div>
					</If>
				</div>
			</div>
		)
	}
});

module.exports = PermissionAcceptPage;