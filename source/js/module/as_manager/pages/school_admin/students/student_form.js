const	React				= require('react'),
		Morearty			= require('morearty'),
		Immutable			= require('immutable'),
		Promise 			= require('bluebird'),
		Form				= require('module/ui/form/form'),
		FormField			= require('module/ui/form/form_field'),
		FormColumn			= require('module/ui/form/form_column'),
		FormBlock			= require('module/ui/form/form_block/form_block'),
		FormElementManager	= require('module/ui/form/form_element_manager'),
		FormTitle			= require('module/ui/form/form_title'),
		StudentsFormHelper	= require('./students_form_helper');

/** Tiny student-related Form wrapper */
const StudentForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		schoolId: 		React.PropTypes.string.isRequired,
		title: 			React.PropTypes.string.isRequired,
		onFormSubmit: 	React.PropTypes.func,
		initialForm: 	React.PropTypes.object,
		initialHouse: 	React.PropTypes.object
	},
	componentWillMount: function() {
		this.initCountNextOfKinBlocks();
	},
	componentWillUnmount: function() {
		this.getDefaultBinding().sub('formData').clear();
	},
	initCountNextOfKinBlocks: function() {
		const binding = this.getDefaultBinding();

		const countNextOfKinBlocks = binding.toJS('countNextOfKinBlocks');

		if(typeof countNextOfKinBlocks === 'undefined' || countNextOfKinBlocks === 0) {
			binding.set('countNextOfKinBlocks', StudentsFormHelper.DEF_COUNT_NEXT_KIN_BLOCK);
		}
	},
	getClassService: function () {
		const self = this;
		return function (txt) {
			return window.Server.schoolForms.get(
				{
					schoolId: self.props.schoolId,
					filter: {
						where: {
							name: {
								like: txt
							}
						},
						limit: 100
					}
				});
		}
	},
	getHouseService: function () {
		const self = this;
		return function (txt) {
			return window.Server.schoolHouses.get(
				{
					schoolId: self.props.schoolId,
					filter: {
						where: {
							name: {
								like: txt
							}
						},
						limit: 100
					}
				});
		}
	},
	getGender: function () {
		const gendersArray = [
			{
				value: 'boy',
				id: 'MALE'
			},
			{
				value: 'girl',
				id: 'FEMALE'
			}
		];

		return Promise.resolve(gendersArray);
	},
	clearNextOfKinByIndex: function(index) {
		const binding = this.getDefaultBinding().sub('formData');

		const fieldData = {
			active:	true,
			error:	false,
			value:	''
		};

		binding.meta()
			.atomically()
			.set(`nok_${index}_email`,			Immutable.fromJS(fieldData))
			.set(`nok_${index}_firstName`,		Immutable.fromJS(fieldData))
			.set(`nok_${index}_lastName`,		Immutable.fromJS(fieldData))
			.set(`nok_${index}_phone`,			Immutable.fromJS(fieldData))
			.set(`nok_${index}_relationship`,	Immutable.fromJS(fieldData))
			.commit();

		this.forceUpdate();
	},
	isShowFormElementManager: function() {
		const	binding					= this.getDefaultBinding(),
				formDataBinding			= this.getDefaultBinding().sub('formData'),
				countNextOfKinBlocks	= binding.get('countNextOfKinBlocks'),
				index					= countNextOfKinBlocks - 1;

		const	email			= formDataBinding.meta().toJS(`nok_${index}_email.value`),
				firstName		= formDataBinding.meta().toJS(`nok_${index}_firstName.value`),
				lastName		= formDataBinding.meta().toJS(`nok_${index}_lastName.value`),
				phone			= formDataBinding.meta().toJS(`nok_${index}_phone.value`),
				relationship	= formDataBinding.meta().toJS(`nok_${index}_relationship.value`);

		return (
			(typeof email !== 'undefined' && email !== '') ||
			(typeof firstName !== 'undefined' && firstName !== '') ||
			(typeof lastName !== 'undefined' && lastName !== '') ||
			(typeof phone !== 'undefined' && phone !== '') ||
			(typeof relationship !== 'undefined' && relationship !== '')
		);
	},
	onClickAddNextOfKinItem: function() {
		const	binding					= this.getDefaultBinding(),
				countNextOfKinBlocks	= binding.get('countNextOfKinBlocks');

		binding.set('countNextOfKinBlocks', countNextOfKinBlocks + 1);
	},
	onClickRemoveNextOfKinBlock: function(index) {
		const	binding					= this.getDefaultBinding(),
				countNextOfKinBlocks	= binding.get('countNextOfKinBlocks');

		binding.set('countNextOfKinBlocks', countNextOfKinBlocks - 1);

		this.clearNextOfKinByIndex(index);
	},
	renderNextOfKin: function(index) {
		const	binding					= this.getDefaultBinding(),
				countNextOfKinBlocks	= binding.get('countNextOfKinBlocks');

		const	isVisible				= index < countNextOfKinBlocks;

		return (
			<FormBlock
				isVisible			= { isVisible }
				isShowCloseButton	= { index !== 0 }
				onClickClose		= { this.onClickRemoveNextOfKinBlock.bind(this, index) }
			>
				<FormField
					type		= 'text'
					field		= { `nok_${index}_relationship` }
				>
					Relationship
				</FormField>
				<FormField
					type		= 'text'
					field		= { `nok_${index}_firstName` }
				>
					Name
				</FormField>
				<FormField
					type		= 'text'
					field		= { `nok_${index}_lastName` }
				>
					Surname
				</FormField>
				<FormField
					type		='phone'
					field		={`nok_${index}_phone`}
					validation	='phone'
				>
					Phone
				</FormField>
				<FormField
					type		= 'text'
					field		= { `nok_${index}_email` }
					validation	= 'email'
				>
					Email
				</FormField>
			</FormBlock>
		);
	},
	renderNextOfKinColumn: function() {
		const	binding					= this.getDefaultBinding(),
				countNextOfKinBlocks	= binding.get('countNextOfKinBlocks');

		const nextOfKins = [];

		for(let i = 0; i < StudentsFormHelper.MAX_COUNT_NEXT_KIN_BLOCK; i++) {
			nextOfKins.push(
				this.renderNextOfKin(i)
			);
		}

		return (
			<FormColumn
				key			= 'next_of_kin_column'
				customStyle	= 'col-md-5 col-md-offset-1'
			>
				<FormTitle text={'Next of kin'}/>
				{ nextOfKins }
				{ this.renderFormElementManager() }
			</FormColumn>
		);
	},
	renderFormElementManager: function() {
		return (
			<FormElementManager
				isVisible	= { this.isShowFormElementManager() }
				text		= { 'Add new "Next of kin" item' }
				onClick		= { this.onClickAddNextOfKinItem }
			/>
		);
	},
	render: function () {
		const binding = this.getDefaultBinding();

		return (
			<div className='eStudentForm container'>
				<Form
					formStyleClass	= 'row'
					onSubmit		= { this.props.onFormSubmit }
					binding			= { binding.sub('formData') }
					submitOnEnter	= { false }
				>
					<FormColumn
						key			= 'main_column'
						customStyle	= 'col-md-5 col-md-offset-1'
					>
						<FormTitle text={'Summary'}/>
						<FormField
							labelText	='+'
							type		= 'imageFile'
							field		= 'avatar'
						/>
						<FormField
							type		= 'text'
							field		= 'firstName'
							validation	= 'required'
						>
							Name
						</FormField>
						<FormField
							type		= 'text'
							field		= 'lastName'
							validation	= 'required'
						>
							Surname
						</FormField>
						<FormField
							type			= 'radio'
							field			= 'gender'
							sourcePromise	= { this.getGender }
							validation		= 'required'
						>
							Gender
						</FormField>
						<FormField
							type		= 'date'
							field		= 'birthday'
							validation	= 'birthday'
						>
							Date of birth
						</FormField>
						<FormField
							type			= 'autocomplete'
							serviceFullData	= { this.getClassService() }
							field			= 'formId'
							defaultItem		= { this.props.initialForm }
						>
							Form
						</FormField>
						<FormField
							type			= 'autocomplete'
							serviceFullData	= { this.getHouseService() }
							field			= 'houseId'
							defaultItem		= { this.props.initialHouse }
						>
							House
						</FormField>
						<FormField
							classNames	= 'mSingleLine'
							type		= 'checkbox'
							field		= 'unwell'
						>
							Injured/Unwell
						</FormField>
						<FormField
							type	= 'textarea'
							field	= 'medicalInfo'
						>
							Medical Information
						</FormField>
					</FormColumn>
					{ this.renderNextOfKinColumn() }
				</Form>
			</div>
		)
	}
});

module.exports = StudentForm;