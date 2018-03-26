const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		{If}				= require('module/ui/if/if'),
		{Autocomplete} 		= require('module/ui/autocomplete2/OldAutocompleteWrapper'),
		{AdminPermissionAcceptParentDoubleRequestTooltip} = require('module/as_admin/pages/admin_schools/admin_views/admin_permission_accept/admin_permission_accept_parent/admin_permission_accept_parent_double_request_tooltip'),
		{AdminPermissionAcceptTooltipWrapper} = require('module/as_admin/pages/admin_schools/admin_views/admin_permission_accept/admin_permission_accept_parent/admin_permission_accept_tooltip_wrapper'),
		Loader				= require('module/ui/loader'),
		Timezone			= require('moment-timezone'),
		RoleHelper			= require('module/helpers/role_helper'),
		Popup               = require('module/ui/popup'),
		{StudentForm} 		= require('module/as_admin/pages/admin_schools/admin_views/admin_permission_accept/admin_permission_accept_parent/student_form.tsx'),
		SquareCrossButton	= require('module/ui/square_cross_button');

const propz = require('propz');

const	MiddleWideContainer	= require('styles/ui/b_middle_wide_container.scss');
const	StudentFormPopup	= require('styles/pages/register/b_student_form_register_popup.scss');

const 	ERROR_ADD_CHILD_TEXT = 'Unable to add permission to this user. Probably this user is already a parent of this student.';

const AdminPermissionAcceptParent = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		afterSubmitPage: React.PropTypes.string
	},
	getDefaultState: function () {
		return Immutable.fromJS({
			permissionId: null,
			comment: null,
			schoolId: null,
			school: null,
			formId: null,
			houseId: null,
			studentId: null,
			isSync: false
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
		binding.set('formInputKey', Immutable.fromJS(this.generatePostcodeInputKey()));
		binding.set('studentInputKey', Immutable.fromJS(this.generatePostcodeInputKey()));
		binding.set('prId', prId);
		binding.set('schoolId', schoolId);
		binding.set('errorAddChild', false);

		if (prId) {
			window.Server.school.get( {schoolId: schoolId} )
			.then(data => {
				binding.set('school', Immutable.fromJS(data));

				return window.Server.permissionRequest.get(
					{
						prId:		prId,
						schoolId:	schoolId
					}
				)
			})
			.then(permissionRequest => {

				binding.set('permissionRequest', permissionRequest);
				binding.set('requester', permissionRequest.requester);
				binding.set('comment', permissionRequest.requestedPermission.comment);

				const formPromise = (
						permissionRequest.requestedPermission.childFormId ?
							window.Server.schoolForm.get(
								{
									schoolId:	schoolId,
									formId:		permissionRequest.requestedPermission.childFormId
								}
							):
							Promise.resolve(undefined)
					),
					housePromise = (
						permissionRequest.requestedPermission.childHouseId ?
							window.Server.schoolHouse.get(
								{
									schoolId:	schoolId,
									houseId:	permissionRequest.requestedPermission.childHouseId
								}
							):
							Promise.resolve(undefined)
					),
					userPermissions = (
						window.Server.schoolUserPermissions.get(
							{
								schoolId: schoolId,
								userId: permissionRequest.requesterId
							}
					));

				return Promise.all([
					formPromise,
					housePromise,
					userPermissions
				])
			})
			.then( data => {
					const  permissions = data[2];

				const linkedStudents = permissions
					.filter(p => p.preset === RoleHelper.USER_ROLES.PARENT)
					.map(p => p.studentId);

				binding.set('linkedStudentIds', Immutable.fromJS(linkedStudents));
				binding.set('studentFormFromRequest', Immutable.fromJS(data[0]));
				binding.set('studentHouseFromRequest', Immutable.fromJS(data[1]));
				binding.set('isSync', true);
			});

		}
	},
	getChildDetails: function () {
		const 	binding = this.getDefaultBinding(),
				permissionRequest = binding.toJS('permissionRequest');

		const childDetails = [];

		if (typeof permissionRequest.requestedPermission.childDateOfBirth !== 'undefined') {
			childDetails.push(`DOB: ${Timezone.tz(permissionRequest.requestedPermission.childDateOfBirth,
				window.timezone).format('DD.MM.YY')}`);
		}

		if (typeof permissionRequest.requestedPermission.childGender !== 'undefined') {
			childDetails.push(`Gender: ${permissionRequest.requestedPermission.childGender}`);
		}

		if (binding.toJS('studentFormFromRequest')) {
			childDetails.push(`Form: ${binding.toJS('studentFormFromRequest').name}`);
		}

		if (binding.toJS('studentHouseFromRequest')) {
			childDetails.push(`House: ${binding.toJS('studentHouseFromRequest').name}`);
		}

		return childDetails.length > 0 ? childDetails.join(', ') : undefined;
	},
	generatePostcodeInputKey: function() {
		// just current date in timestamp view
		return + new Date();
	},
	getFormIds: function () {
		const binding = this.getDefaultBinding();

		const formIds = [];

		const formId = binding.get('formId');
		if(typeof formId !== 'undefined') {
			formIds.push(formId);
		}

		return formIds;
	},
	getFormFromSelectedStudent: function() {
		return propz.get(this.getDefaultBinding().toJS('selectedStudent'), ['form'], undefined);
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
	getHouseFromSelectedStudent: function() {
		return propz.get(this.getDefaultBinding().toJS('selectedStudent'), ['house'], undefined);
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
				},
				limit: 100
			}
		});
	},
	onSelectForm: function(formId) {
		const binding = this.getDefaultBinding();

		binding.set('formId', formId);
		this.deselectStudent();
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
				},
				limit: 100
			}
		});
	},
	onSelectHouse: function(houseId) {
		const binding = this.getDefaultBinding();

		binding.set('houseId', houseId);
		this.deselectStudent();
	},
	serviceStudentsFilter: function(name) {
		const	binding		= this.getDefaultBinding();

		let		filter;
		
		if (name === '') {
			filter = {
				limit: 100,
				where: {}
			}
		} else {
			filter = {
				limit: 100,
				where: {
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

		const formIdArray	= this.getFormIds();
		if(formIdArray.length !== 0) {
			filter.where.formId = { $in: formIdArray };
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
	onSelectStudent: function(studentId, student) {
		const binding = this.getDefaultBinding();

		binding.set('studentId', studentId);
		binding.set('selectedStudent', Immutable.fromJS(student));
	},
	handleDeselectStudent: function () {
		this.deselectForm();
		this.deselectHouse();
		this.deselectStudent();
	},
	deselectStudent: function () {
		const binding = this.getDefaultBinding();

		binding.set('studentId', undefined);
		binding.set('selectedStudent', undefined);
		binding.set('studentInputKey', Immutable.fromJS(this.generatePostcodeInputKey()));
	},
	handleClickStudentFromTooltip: function (student) {
		this.deselectForm();
		this.deselectHouse();
		this.deselectStudent();
		this.getDefaultBinding().set('studentId', student.id);
		this.getDefaultBinding().set('selectedStudent', Immutable.fromJS(student));
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
		})
		.catch((e) => {
			if (e.xhr.status === 404) {
				binding.set('errorAddChild', true);
			}
		});
	},
	onAcceptPermissionAndAddStudent: function() {
		const	binding		= this.getDefaultBinding();

		const	prId		= binding.get('prId'),
				schoolId	= binding.get('schoolId'),
				data        = binding.toJS('dataNewStudent');

		window.Server.schoolStudents.post(binding.get('schoolId'), data)
		.then(student => {
			return window.Server.statusPermissionRequest.put(
				{ schoolId, prId },
				{ status:'ACCEPTED', studentId: student.id }
			)
		})
		.then(() => {
			document.location.hash = this.props.afterSubmitPage;
		})
		.catch((e) => {
			if (e.xhr.status === 404) {
				binding.set('errorAddChild', true);
			}
		});
	},
	handleClickCancelAcceptPermissionAndAddStudent: function() {
		const	binding		= this.getDefaultBinding();

		binding.remove('dataNewStudent');
	},
	onClickDeselectForm: function() {
		this.deselectForm();
		this.deselectStudent();
	},
	deselectForm: function () {
		const binding = this.getDefaultBinding();

		binding.set('formId', undefined);
		binding.set('formInputKey', Immutable.fromJS(this.generatePostcodeInputKey()));
	},
	onClickDeselectHouse: function() {
		this.deselectHouse();
		this.deselectStudent();
	},
	deselectHouse: function () {
		const binding = this.getDefaultBinding();

		binding.set('houseId', undefined);
		binding.set('houseInputKey', Immutable.fromJS(this.generatePostcodeInputKey()));
	},
	renderTooltips() {
		const binding = this.getDefaultBinding();
		const linkedStudentIds = binding.toJS('linkedStudentIds');
		const studentId = binding.toJS('studentId');

		if(linkedStudentIds.findIndex(id => id === studentId) !== -1) {
			const selectedStudent = binding.toJS('selectedStudent');
			const childName = `${selectedStudent.firstName} ${selectedStudent.lastName}`;

			return <AdminPermissionAcceptParentDoubleRequestTooltip childName={childName}/>;
		} else {
			return (
				<AdminPermissionAcceptTooltipWrapper
					binding={this.getDefaultBinding().sub('adminPermissionAcceptTooltipWrapper')}
					permissionRequest={this.getDefaultBinding().toJS('permissionRequest')}
					handleClickStudent={this.handleClickStudentFromTooltip}
				/>
			);
		}
	},
	addNewStudent: function () {
		this.getDefaultBinding().set("isAddStudentPopupOpen", true);
		this.setStudentFormData();
	},
	renderAddStudentPopupOpen: function () {
		const   binding         = this.getDefaultBinding(),
				initialForm		= binding.toJS('studentForm.form'),
				initialHouse	= binding.toJS('studentForm.house');

		return (
			<Popup
				binding         = { binding }
				stateProperty   = { "isAddStudentPopupOpen" }
				onRequestClose  = { () => binding.set("isAddStudentPopupOpen", false) }
				otherClass      = 'bStudentRegPopup'
			>
				<StudentForm
					initialForm		= { initialForm }
					initialHouse	= { initialHouse }
					onFormSubmit	= { this.onSubmitStudentForm }
					onClickBack	    = { () => binding.set("isAddStudentPopupOpen", false) }
					schoolId		= { binding.get('schoolId') }
					binding			= { binding }
				/>
			</Popup>
		)
	},
	onSubmitStudentForm: function (student) {
		const   binding = this.getDefaultBinding();

		binding.set("isAddStudentPopupOpen", false);
		binding.set("dataNewStudent", Immutable.fromJS(student));

	},
	setStudentFormData: function () {
		const   binding = this.getDefaultBinding(),
				permissionRequest = binding.toJS('permissionRequest');

		const student = {};

		student.form 	= binding.toJS('studentFormFromRequest');
		student.formId 	= binding.toJS('studentFormFromRequest') ? binding.toJS('studentFormFromRequest').id : undefined;
		student.house 	= binding.toJS('studentHouseFromRequest');
		student.houseId = binding.toJS('studentHouseFromRequest') ? binding.toJS('studentHouseFromRequest').id : undefined;

		if (binding.sub('adminPermissionAcceptTooltipWrapper').toJS('studentFirstNameFromRequest')) {
			student.firstName 	= binding.sub('adminPermissionAcceptTooltipWrapper').toJS('studentFirstNameFromRequest');
		}
		if (binding.sub('adminPermissionAcceptTooltipWrapper').toJS('studentLastNameFromRequest')) {
			student.lastName 	= binding.sub('adminPermissionAcceptTooltipWrapper').toJS('studentLastNameFromRequest');
		}

		if (permissionRequest.requestedPermission.childGender) {
			student.gender 	= permissionRequest.requestedPermission.childGender;
		}

		if (permissionRequest.requestedPermission.childDateOfBirth) {
			student.birthday 	= permissionRequest.requestedPermission.childDateOfBirth;
		}

		binding.set('studentForm', Immutable.fromJS(student));
	},
	getParentName: function () {
		const 	binding = this.getDefaultBinding(),
				requester = binding.toJS('requester');

		return `${typeof requester.firstName !== 'undefined' ? requester.firstName : ''} ${typeof requester.lastName !== 'undefined' ? requester.lastName : ''}`;
	},
	render: function() {
		const 	binding = this.getDefaultBinding(),
				errorAddChild = binding.get('errorAddChild'),
				comment = binding.get('comment');

		let content;
		if(binding.toJS('isSync')) {
			const   childDetails = this.getChildDetails(),
					canCreateStudentFromParentPermissionRequest = binding.toJS('school').canCreateStudentFromParentPermissionRequest;

			content = (
				<div>
					<div className='bForm'>
						<div className="eForm_atCenter">

							<h2 className='eForm_header mBlack'>{ binding.toJS('school.name') }.</h2>

							<h2 className='eForm_header mBlack'>Accept parent permission {this.getParentName()}.</h2>
							{ typeof binding.get('dataNewStudent') === 'undefined' ?
								<div>
									<h3 className='eForm_header mBlack'>Comment from parent: {comment}</h3>

									{childDetails ?
										<h3 className='eForm_header mBlack'>Child details received from parent: {childDetails}</h3>
										:
										null
									}

									{
										canCreateStudentFromParentPermissionRequest ?
											<h2 className='eForm_header mBlack'>Please choose student
												or <a onClick={() => this.addNewStudent()}>add a new student</a>.</h2>
											:
											<h2 className='eForm_header mBlack'>Please choose student.</h2>
									}


									<div className='eForm_field'>
										<Autocomplete
											key={binding.toJS('formInputKey')}
											defaultItem={this.getFormFromSelectedStudent()}
											serviceFilter={this.serviceFormFilter}
											serverField='name'
											onSelect={this.onSelectForm}
											placeholder='Form'
											extraCssStyle={'mWidth350 mInline mRightMargin'}
										/>
										<SquareCrossButton
											handleClick={this.onClickDeselectForm}
										/>
									</div>

									< div className='eForm_field'>
									<Autocomplete
									key                = {binding.toJS('houseInputKey')}
									defaultItem     = {this.getHouseFromSelectedStudent()}
									serviceFilter    = {this.serviceHouseFilter}
									serverField        = 'name'
									onSelect        = {this.onSelectHouse}
									placeholder        = 'House'
									extraCssStyle    = {'mWidth350 mInline mRightMargin'}
									/>
									<SquareCrossButton
									handleClick = {this.onClickDeselectHouse}
									/>
									</div>

									<div className='eForm_field'>
								{
									errorAddChild &&
									<span className="verify_error">{ERROR_ADD_CHILD_TEXT}</span>
								}
									<Autocomplete
									key                = {binding.toJS('studentInputKey')}
									defaultItem     = {binding.toJS('selectedStudent')}
									serviceFilter    = {this.serviceStudentsFilter}
									serverField        = 'name'
									onSelect        = {this.onSelectStudent}
									placeholder        = 'Student name'
									extraCssStyle    = {'mWidth350 mInline mRightMargin'}
									/>
									<SquareCrossButton
									handleClick = {this.handleDeselectStudent}
									/>
									</div>

									{this.renderTooltips()}

								</div>
								:
								<div></div>
							}

							<If condition={typeof binding.get('studentId') !== 'undefined' && typeof binding.get('dataNewStudent') === 'undefined'}>
								<div
									className	= "bButton"
									onClick		= { this.onAcceptPermission }
								>
									Accept permission
								</div>
							</If>

							<If condition={typeof binding.get('dataNewStudent') !== 'undefined'}>
								<div>
									<div
										className	= "bButton mCancel"
										onClick		= { () => this.handleClickCancelAcceptPermissionAndAddStudent() }
									>
										Cancel
									</div>
									<div
										className	= "bButton"
										onClick		= { () => this.onAcceptPermissionAndAddStudent() }
									>
										Accept permission and add new student
									</div>
								</div>
							</If>
						</div>
					</div>
					{ this.renderAddStudentPopupOpen() }
				</div>
			)
		} else {
			content = <Loader condition={true}/>;
		}

		return (
			<div className='bMiddleWideContainer'>
				{content}
			</div>
		);

	}
});

module.exports = AdminPermissionAcceptParent;