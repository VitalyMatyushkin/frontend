const 	Form				= require('module/ui/form/form'),
		FormField			= require('module/ui/form/form_field'),
		FormColumn			= require('module/ui/form/form_column'),
		FormBlock			= require('module/ui/form/form_block'),
		FormElementManager	= require('module/ui/form/form_element_manager'),
		FormTitle			= require('module/ui/form/form_title'),
		Promise 			= require('bluebird'),
		Morearty			= require('morearty'),
		React 				= require('react');

/** Tiny student-related Form wrapper */
const StudentForm = React.createClass({
	mixins: [Morearty.Mixin],
	MAX_COUNT_NEXT_KIN_BLOCK: 5,
	propTypes: {
		schoolId: 		React.PropTypes.string.isRequired,
		title: 			React.PropTypes.string.isRequired,
		onFormSubmit: 	React.PropTypes.func,
		initialForm: 	React.PropTypes.object,
		initialHouse: 	React.PropTypes.object
	},
	componentWillMount: function() {
		const binding = this.getDefaultBinding();

		//TODO set right count of nextOfKin
		binding.set('countNextOfKinBlocks', 1);
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
	addNextOfKinItem: function() {
		const	binding					= this.getDefaultBinding(),
				countNextOfKinBlocks	= binding.get('countNextOfKinBlocks');

		binding.set('countNextOfKinBlocks', countNextOfKinBlocks + 1);
	},
	renderNextOfKin: function(index) {
		const	binding					= this.getDefaultBinding(),
				countNextOfKinBlocks	= binding.get('countNextOfKinBlocks');

		const	isVisible				= index <= countNextOfKinBlocks;

		return (
			<FormBlock isVisible={ isVisible }>
				<FormField
					type		= 'text'
					field		= { `nok_${index}_relationship` }
					isVisible	= { isVisible }
				>
					Relationship
				</FormField>
				<FormField
					type		= 'text'
					field		= { `nok_${index}_firstName` }
					isVisible	= { isVisible }
				>
					Name
				</FormField>
				<FormField
					type		= 'text'
					field		= { `nok_${index}_lastName` }
					isVisible	= { isVisible }
				>
					Surname
				</FormField>
				<FormField
					type		='phone'
					field		={`nok_${index}_phone`}
					validation	='phone'
					isVisible	= { isVisible }
				>
					Phone
				</FormField>
				<FormField
					type		= 'text'
					field		= { `nok_${index}_email` }
					validation	= 'email'
					isVisible	= { isVisible }
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

		for(let i = 1; i <= this.MAX_COUNT_NEXT_KIN_BLOCK; i++) {
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
				<FormElementManager
					text	= { 'Add new "Next of kin" item' }
					onClick	= { this.addNextOfKinItem }
				/>
			</FormColumn>
		);
	},
	render: function () {
		const binding = this.getDefaultBinding();

		return (
			<div className='eStudentForm container'>
				<Form
					formStyleClass	= 'row'
					onSubmit		= { this.props.onFormSubmit }
					binding			= { binding }
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