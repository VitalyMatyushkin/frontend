const 	RegistrationPermissions		= require('module/ui/register/user/registration_permissions'),
		classNames					= require('classnames'),
		Morearty					= require('morearty'),
		React						= require('react');

/** component which show list of roles to join with and some info on requested role details*/
const PermissionsStep = React.createClass({
	mixins: [Morearty.Mixin],
	displayName: 'PermissionsList',
	propTypes: {
		onSuccess: React.PropTypes.func
	},
	componentWillMount: function () {
		const 	binding = this.getDefaultBinding();

		this.types 			= ['parent', 'admin', 'manager', 'teacher', 'coach'];
		this.visibleTypes 	= ['Parent', 'School Admin', 'School Manager', 'PE Teacher', 'Coach'];	// how to render values from self.types. HACK!! :)

		binding.set('currentFieldArray', 0);

		binding.sub('fields.0.schoolId').addListener(descriptor => {
			if (descriptor.isValueChanged()) {
				binding.sub('formId').clear();
				binding.sub('formName').clear();
				binding.sub('houseId').clear();
				binding.sub('houseName').clear();
			}
		});
		binding.sub('fields.1.schoolId').addListener(descriptor => {
			if (descriptor.isValueChanged()) {
				binding.sub('formId').clear();
				binding.sub('formName').clear();
				binding.sub('houseId').clear();
				binding.sub('houseName').clear();
			}
		});
		binding.sub('fields.2.schoolId').addListener(descriptor => {
			if (descriptor.isValueChanged()) {
				binding.sub('formId').clear();
				binding.sub('formName').clear();
				binding.sub('houseId').clear();
				binding.sub('houseName').clear();
			}
		});
	},
	onClickType: function (type) {
		const binding = this.getDefaultBinding();
		binding.set('type', type);
	},

	addFieldArray: function(){
		const 	binding 			= this.getDefaultBinding();
		let 	currentFieldArray 	= binding.get('currentFieldArray');

		currentFieldArray++;
		binding.set('currentFieldArray', currentFieldArray);
	},

	/** will render list with all available roles to join */
	renderChooser: function () {
		const 	binding	= this.getDefaultBinding();

		return <div className="eRegistration_chooser">
			{this.types.map( (type, i) => {
				const itemClasses = classNames({
					eRegistration_chooserItem: true,
					mActive: binding.get('type') === type
				});

				return <div key={type} className={itemClasses} onClick={this.onClickType.bind(null, type)}>
					<div className="eChooserItem_wrap">
						<div className="eChooserItem_inside"></div>
					</div>
					<span className="eRegistration_chooserTitle">{this.visibleTypes[i]}</span>
				</div>;
			})}
		</div>
	},
	isFormFilled: function (currentType) {
		const 	binding = this.getDefaultBinding();

		return (
				(
					currentType === 'admin' || currentType === 'manager' ||
					currentType === 'teacher' || currentType === 'coach'
				) && binding.get('fields.0.schoolId')
			) ||
			(
				currentType === 'parent' &&
				binding.get('fields.0.schoolId') && binding.get('fields.0.houseId') &&
				binding.get('fields.0.formId') && binding.get('fields.0.firstName') &&
				binding.get('fields.0.lastName')
			);
	},

	handleSchoolSelect: function(schoolId, fieldNumber) {
		const 	binding 			= this.getDefaultBinding();

		binding.set('fields.' + fieldNumber + '.schoolId', schoolId);
	},

	handleHouseSelect: function(houseId, houseName, fieldNumber) {
		const 	binding 			= this.getDefaultBinding(),
				currentFieldArray	= binding.get('currentFieldArray');
		binding
			.atomically()
			.set('fields.' + fieldNumber + '.houseId', houseId)
			.set('fields.' + fieldNumber + '.houseName', houseName)
			.commit();
	},

	handleFormSelect: function(formId, formName, fieldNumber) {
		const 	binding 			= this.getDefaultBinding(),
				currentFieldArray	= binding.get('currentFieldArray');
		binding
			.atomically()
			.set('fields.' + fieldNumber + '.formId', formId)
			.set('fields.' + fieldNumber + '.formName', formName)
			.commit();
	},

	handleFirstNameChange: function(firstName, fieldNumber) {
		const 	binding 			= this.getDefaultBinding(),
				currentFieldArray	= binding.get('currentFieldArray');
		binding.set('fields.' + fieldNumber + '.firstName', firstName);
	},

	handleLastNameChange: function(lastName, fieldNumber) {
		const 	binding 			= this.getDefaultBinding(),
				currentFieldArray	= binding.get('currentFieldArray');

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
				{this.renderChooser()}
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
