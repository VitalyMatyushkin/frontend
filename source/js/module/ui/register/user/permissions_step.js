const   RegistrationPermissions 	= require('module/ui/register/user/registration_permissions'),
        classNames                  = require('classnames'),
		Morearty            		= require('morearty'),
        React                       = require('react');


let multipleFields;

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
		multipleFields = 1;
	},
	_onClickType: function (type) {
		const binding = this.getDefaultBinding();
		binding.set('type', type);
	},
	fieldsMultiplier: function () {
		if (multipleFields <= 2) {
			multipleFields += 1;
		}
		this.forceUpdate();
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

				return <div key={type} className={itemClasses} onClick={this._onClickType.bind(null, type)}>
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

	handlerSelectSchool: function(schoolId, numberField) {
		const 	binding 			= this.getDefaultBinding();

		binding.set('fields.' + numberField + '.schoolId', schoolId);
	},

	handlerSelectHouse: function(houseId, houseName, numberField) {
		const 	binding 			= this.getDefaultBinding(),
				currentFieldArray	= binding.get('currentFieldArray');
		binding
			.atomically()
			.set('fields.' + numberField + '.houseId', houseId)
			.set('fields.' + numberField + '.houseName', houseName)
			.commit();
	},

	handlerSelectForm: function(formId, formName, numberField) {
		const 	binding 			= this.getDefaultBinding(),
				currentFieldArray	= binding.get('currentFieldArray');
		binding
			.atomically()
			.set('fields.' + numberField + '.formId', formId)
			.set('fields.' + numberField + '.formName', formName)
			.commit();
	},

	handlerChangeFirstName: function(firstName, numberField) {
		const 	binding 			= this.getDefaultBinding(),
				currentFieldArray	= binding.get('currentFieldArray');
		binding.set('fields.' + numberField + '.firstName', firstName);
	},

	handlerChangeLastName: function(lastName, numberField) {
		const 	binding 			= this.getDefaultBinding(),
				currentFieldArray	= binding.get('currentFieldArray');

		binding.set('fields.' + numberField + '.lastName', lastName);
	},

	handlerChangeComment: function(comment) {
		const 	binding = this.getDefaultBinding();

		binding.set('comment', comment);
	},

	handlerChangePromo: function(promo) {
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
						handlerSelectSchool 	= { this.handlerSelectSchool }
						handlerSelectHouse		= { this.handlerSelectHouse }
						handlerSelectForm		= { this.handlerSelectForm }
						handlerChangeFirstName	= { this.handlerChangeFirstName }
						handlerChangeLastName	= { this.handlerChangeLastName }
						handlerChangeComment	= { this.handlerChangeComment }
						handlerChangePromo		= { this.handlerChangePromo }
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
