const 	RegistrationPermissions		= require('module/ui/register/user/registration_permissions'),
		classNames					= require('classnames'),
		Morearty					= require('morearty'),
		React						= require('react'),
		Lazy						= require('lazy.js');

const 	types 			= ['parent', 'admin', 'manager', 'teacher', 'coach'],
		visibleTypes 	= ['Parent', 'School Admin', 'School Manager', 'PE Teacher', 'Coach'];



/** component which show list of roles to join with and some info on requested role details*/
const PermissionsStep = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		onSuccess: React.PropTypes.func
	},
	/**
	 * Trigger to be called when role changed
	 * @param {String} type one of ['parent', 'admin', 'manager', 'teacher', 'coach']
	 */
	onClickType: function (type) {
		const binding = this.getDefaultBinding();
		binding.set('currentFieldArray', 0);

		/* cleaning all binding fields except schoolId - we will need it anyway */
		for (let i=0; i<=2; i++) {
			binding.sub('fields.' + i + '.formId').clear();
			binding.sub('fields.' + i + '.formName').clear();
			binding.sub('fields.' + i + '.houseId').clear();
			binding.sub('fields.' + i + '.houseName').clear();
			binding.sub('fields.' + i + '.firstName').clear();
			binding.sub('fields.' + i + '.lastName').clear();
		}
		binding.set('type', type);
	},

	/** For Parent permission request only. It will add items to array to make
	 * possible having multiple children for parent
	 */
	addFieldArray: function(){
		const 	binding 			= this.getDefaultBinding();
		let 	currentFieldArray 	= binding.get('currentFieldArray');

		currentFieldArray++;
		binding.set('currentFieldArray', currentFieldArray);
	},

	/** will render list with all available roles to join */
	renderChoosers: function () {
		const 	binding			= this.getDefaultBinding();

		return <div className="eRegistration_chooser">
			{types.map( (type, i) => {
				const itemClasses = classNames({
					eRegistration_chooserItem: true,
					mActive: binding.get('type') === type
				});

				return (
					<div key={type} className={itemClasses} onClick={() => this.onClickType(type)}>
						<div className="eChooserItem_wrap">
							<div className="eChooserItem_inside"></div>
						</div>
						<span className="eRegistration_chooserTitle">{visibleTypes[i]}</span>
					</div>
				);
			})}
		</div>
	},
	/**
	 * Check if form filled for provided permission type (currentType)
	 * @param {String} currentType current selected role
	 * @returns {boolean}
	 */
	isFormFilled: function (currentType) {
		const 	binding						= this.getDefaultBinding(),
				rolesRequiredSchoolIdOnly	= Lazy(['admin', 'manager', 'teacher', 'coach']),
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
	handleSchoolSelect: function(schoolId, fieldNumber) {
		const 	binding = this.getDefaultBinding();

		binding.set('fields.' + fieldNumber + '.schoolId', schoolId);
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

	handleCommentChange: function(comment) {
		const 	binding = this.getDefaultBinding();

		binding.set('comment', comment);
	},

	handlePromoChange: function(promo) {
		const 	binding = this.getDefaultBinding();

		binding.set('promo', promo);
	},

	render: function () {
		const 	binding 			= this.getDefaultBinding(),
				currentType 		= binding.get('type'),
				currentFieldArray	= binding.get('currentFieldArray'),
				fieldsAr			= binding.toJS('fields');

		let isShowFinishButton = false;

		if (this.isFormFilled(currentType)) {
			isShowFinishButton = true;
		}

		return (
			<div className="eRegistration_permissions">
				<div className="eRegistration_annotation">Join as:</div>
				{this.renderChoosers()}
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
