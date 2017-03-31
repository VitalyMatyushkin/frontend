const	RegistrationPermissions		= require('./registration_permissions'),
		PermissionRoleSelector		= require('./permission_role_selector'),
		Morearty					= require('morearty'),
		React						= require('react'),
		Lazy						= require('lazy.js');

/** component which show list of roles to join with and some info on requested role details*/
const PermissionsStep = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSuccess: React.PropTypes.func
	},
	componentWillMount: function(){
		const binding = this.getDefaultBinding();
		binding.clear('type');
	},
	/**
	 * Trigger to be called when role changed
	 * @param {String} type one of ['parent', 'admin', 'manager', 'teacher', 'coach', 'student']
	 */
	onClickType: function (type) {
		const binding = this.getDefaultBinding();

		binding.set('currentFieldArray', 0);

		if (type === 'student') {
			this.checkSchoolAvailibleForRegistrationStudent();
		}

		/* cleaning all binding fields except schoolId - we will need it anyway */
		for (let i=0; i<=2; i++) {
			binding.sub('fields.' + i + '.formId').remove();
			binding.sub('fields.' + i + '.formName').remove();
			binding.sub('fields.' + i + '.houseId').remove();
			binding.sub('fields.' + i + '.houseName').remove();
			binding.sub('fields.' + i + '.firstName').remove();
			binding.sub('fields.' + i + '.lastName').remove();
			binding.sub('fields.' + i + '.comment').remove();
			binding.sub('fields.' + i + '.promo').remove();
		}
		/**
		 * If select role parent and add three child, then change role
		 * we must clear schoolId[1,2], schoolName[1,2] except schoolId[0], schoolName[0],
		 * because this field we use for all roles
		 */
		binding.sub('fields.1.schoolId').remove();
		binding.sub('fields.2.schoolId').remove();
		binding.sub('fields.1.schoolName').remove();
		binding.sub('fields.2.schoolName').remove();
		binding.set('type', type);
	},
	/**
	 * If we change role on student from any other role, we must check, that selected school is availible for registration students
	 * If no, we clear field schoolId, schoolName in binding
	 */
	checkSchoolAvailibleForRegistrationStudent: function() {
		const 	binding = this.getDefaultBinding(),
				schoolId = binding.get('fields.0.schoolId');
		
		if (typeof schoolId !== "undefined") {
			window.Server.publicSchool.get({schoolId: schoolId}).then( school => {
				if (school.studentSelfRegistrationEnabled !== true) {
					binding.sub('fields.0.schoolId').remove();
					binding.sub('fields.0.schoolName').remove();
				}
			});
		}
	},
	/**
	 * For Parent permission request only. It will add items to array to make
	 * possible having multiple children for parent
	 */
	addFieldArray: function(){
		const 	binding 			= this.getDefaultBinding();
		let 	currentFieldArray 	= binding.get('currentFieldArray');

		currentFieldArray++;
		binding.set('currentFieldArray', currentFieldArray);
	},

	/**
	 * Check if form filled for provided permission type (currentType)
	 * @param {String} currentType current selected role
	 * @returns {boolean}
	 */
	isFormFilled: function (currentType) {
		const 	binding						= this.getDefaultBinding(),
				rolesRequiredSchoolIdOnly	= Lazy(['admin', 'manager', 'teacher', 'coach', 'student']),
				isSchoolPresented			= typeof binding.get('fields.0.schoolId') !== 'undefined';

		return (rolesRequiredSchoolIdOnly.contains(currentType) && isSchoolPresented) || (
				currentType === 'parent' &&
				binding.get('fields.0.schoolId') && binding.get('fields.0.houseId') &&
				binding.get('fields.0.formId') && binding.get('fields.0.firstName') &&
				binding.get('fields.0.lastName')
			);
	},

	/**
	 * Trigger on school selection.
	 * Clears formId, formName, houseId and houseName if any was set before.
	 * @param {String} schoolId new selected school
	 * @param {Number|String} fieldNumber position with permission request in permission request array. For non-parent roles it always 0
	 */
	handleSchoolSelect: function(schoolId, schoolName, fieldNumber) {
		const 	binding = this.getDefaultBinding();
		binding
			.atomically()
			.set('fields.' + fieldNumber + '.schoolId', schoolId)
			.set('fields.' + fieldNumber + '.schoolName', schoolName)
			.commit();
		/**
		 * Clear sub-bindings house/form if change school
		 */
		binding.sub('fields.' + fieldNumber + '.formId').clear();
		binding.sub('fields.' + fieldNumber + '.formName').clear();
		binding.sub('fields.' + fieldNumber + '.houseId').clear();
		binding.sub('fields.' + fieldNumber + '.houseName').clear();
	},

	handleHouseSelect: function(houseId, houseName, fieldNumber) {
		const 	binding = this.getDefaultBinding();

		binding
			.atomically()
			.set('fields.' + fieldNumber + '.houseId', houseId)
			.set('fields.' + fieldNumber + '.houseName', houseName)
			.commit();
	},

	handleFormSelect: function(formId, formName, fieldNumber) {
		const 	binding = this.getDefaultBinding();

		binding
			.atomically()
			.set('fields.' + fieldNumber + '.formId', formId)
			.set('fields.' + fieldNumber + '.formName', formName)
			.commit();
	},

	handleFirstNameChange: function(firstName, fieldNumber) {
		const 	binding = this.getDefaultBinding();

		binding.set('fields.' + fieldNumber + '.firstName', firstName);
	},

	handleLastNameChange: function(lastName, fieldNumber) {
		const 	binding = this.getDefaultBinding();

		binding.set('fields.' + fieldNumber + '.lastName', lastName);
	},

	handleCommentChange: function(comment, fieldNumber) {
		const 	binding = this.getDefaultBinding();

		binding.set('fields.' + fieldNumber + '.comment', comment);
	},

	handlePromoChange: function(promo, fieldNumber) {
		const 	binding = this.getDefaultBinding();

		binding.set('fields.' + fieldNumber + '.promo', promo);
	},

	render: function () {
		const 	binding 				= this.getDefaultBinding(),
				currentType 			= binding.get('type'),
				currentFieldArray		= binding.get('currentFieldArray'),
				fieldsAr				= binding.toJS('fields');

		let isShowFinishButton = false;

		if (this.isFormFilled(currentType)) {
			isShowFinishButton = true;
		}

		return (
			<div className="eRegistration_permissions">
				<div className="eRegistration_annotation">Join as:</div>
				<PermissionRoleSelector
					currentType 			= { currentType }
					onClickType 			= { this.onClickType }
				/>
				<div className="eRegistration_permissionStep">
					<RegistrationPermissions
						isFormFilled			= { isShowFinishButton }
						onSuccess				= { this.props.onSuccess }
						addFieldArray			= { this.addFieldArray }
						handleSchoolSelect 		= { this.handleSchoolSelect }
						handleHouseSelect		= { this.handleHouseSelect }
						handleFormSelect		= { this.handleFormSelect }
						handleFirstNameChange	= { this.handleFirstNameChange }
						handleLastNameChange	= { this.handleLastNameChange }
						handleCommentChange		= { this.handleCommentChange }
						handlePromoChange		= { this.handlePromoChange }
						currentType				= { currentType }
						fieldsAr				= { fieldsAr }
						currentFieldArray		= { currentFieldArray }
					/>
				</div>
			</div>
		)
	}
});

module.exports = PermissionsStep;