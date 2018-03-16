import * as React from 'react';
import * as Morearty from 'morearty';
import * as Immutable from 'immutable';
import * as Form from 'module/ui/form/form';
import * as FormField from 'module/ui/form/form_field';
import * as FormColumn from 'module/ui/form/form_column';
import * as FormBlock from 'module/ui/form/form_block/form_block';
import * as FormElementManager from 'module/ui/form/form_element_manager';

const ADDITIONAL_FIELD_CONDITION= {
	HIDDEN:     'HIDDEN',
	OPTIONAL:   'OPTIONAL',
	REQUIRED:   'REQUIRED'
};

export const ChildStep = (React as any).createClass({
	mixins: [Morearty.Mixin],

	componentWillMount: function() {
		this.initCountChildren();
	},

	componentWillUnmount: function() {
		this.getDefaultBinding().sub('childrenForm').clear();
		this.getDefaultBinding().set('countChildren', 0);
	},

	initCountChildren: function() {
		const binding = this.getDefaultBinding();

		const countChildren = binding.toJS('countChildren');

		if(typeof countChildren === 'undefined' || countChildren === 0) {
			binding.set('countChildren', 1);
		}
	},

	onSubmit: function (data): void {
		if (this.showErrors() === 0) {
			const childrenDataToServer = this.convertChildrenDataToServerFormat();
			this.props.setChild(childrenDataToServer);
		}
	},

	/*
		because standard validation does not work if you change it dynamically
	 */
	showErrors: function () {
		const   binding = this.getDefaultBinding().sub('childrenForm').meta(),
			countChildrenBlocks = this.getDefaultBinding().get('countChildren'),
			school = this.props.school;

		const fieldData = {
			active:	true,
			showError: true,
			value:	''
		};

		let countError = 0;

		for(let index = 0; index < countChildrenBlocks; index++) {
			if (typeof binding.toJS(`child.${index}.firstName`).value === 'undefined' || binding.toJS(`child.${index}.firstName`).value === '')
			{
				binding.set(`child.${index}.firstName`, Immutable.fromJS(fieldData));
				countError ++;
			}

			if (typeof binding.toJS(`child.${index}.lastName`).value === 'undefined' || binding.toJS(`child.${index}.lastName`).value === '')
			{
				binding.set(`child.${index}.lastName`, Immutable.fromJS(fieldData));
				countError ++;
			}

			if (school.additionalPermissionRequestFields.childDateOfBirth === ADDITIONAL_FIELD_CONDITION.REQUIRED &&
				(typeof binding.toJS(`child.${index}.birthday`).value === 'undefined' || binding.toJS(`child.${index}.birthday`).value === ''))
			{
				binding.set(`child.${index}.birthday`, Immutable.fromJS(fieldData));
				countError ++;
			}

			if (school.additionalPermissionRequestFields.childGender === ADDITIONAL_FIELD_CONDITION.REQUIRED &&
				(typeof binding.toJS(`child.${index}.gender`).value === 'undefined' || binding.toJS(`child.${index}.gender`).value === ''))
			{
				const genderField = binding.toJS(`child.${index}.gender`);
				(genderField as any).showError = true;
				binding.set(`child.${index}.gender`, Immutable.fromJS(genderField));
				countError ++;
			}

			if (school.additionalPermissionRequestFields.childForm === ADDITIONAL_FIELD_CONDITION.REQUIRED &&
				(typeof binding.toJS(`child.${index}.formId`).value === 'undefined' || binding.toJS(`child.${index}.formId`).value === ''))
			{
				binding.set(`child.${index}.formId`, Immutable.fromJS(fieldData));
				countError ++;
			}

			if (school.additionalPermissionRequestFields.childHouse === ADDITIONAL_FIELD_CONDITION.REQUIRED &&
				(typeof binding.toJS(`child.${index}.houseId`).value === 'undefined' || binding.toJS(`child.${index}.houseId`).value === ''))
			{
				binding.set(`child.${index}.houseId`, Immutable.fromJS(fieldData));
				countError ++;
			}
		}

		return countError;
	},

	renderChildren: function() {
		const   binding = this.getDefaultBinding(),
				countChildren	= binding.get('countChildren');
		const children = [];

		for(let i = 0; i < countChildren; i++) {
			children.push(
				this.renderChild(i)
			);
		}

		return (
			<FormColumn
				key			= 'children'
			>
				{ children }
				{ this.renderFormElementManager() }
			</FormColumn>
		);
	},
	renderFormElementManager: function() {
		return (
			<FormElementManager
				text={'Add new child'}
				onClick={this.onClickAddChildItem}
				id={'add_child'}
			/>
		);
	},

	onClickAddChildItem: function() {
		const	binding			= this.getDefaultBinding(),
				countChildren	= binding.get('countChildren');

		binding.set('countChildren', countChildren + 1);
	},
	onClickDeleteChildItem: function(index) {
		const	binding			= this.getDefaultBinding(),
				countChildren	= binding.get('countChildren');

		const children = binding.sub('childrenForm').meta().toJS('child');
		let childrenArray = Object.keys(children).map(key => children[key]);
		childrenArray.splice(index, 1);
		binding.sub('childrenForm').meta().set('child', Immutable.fromJS(childrenArray));
		binding.set('countChildren', countChildren - 1);
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

		return gendersArray;
	},

	getClassService: function () {
		return (txt) => {
			return (window as any).Server.publicSchoolForms.get(
				{
					schoolId: this.props.school.id,
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
		return (txt) => {
			return (window as any).Server.publicSchoolHouses.get(
				{
					schoolId: this.props.school.id,
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

	renderChild: function (index) {
		const	binding					= this.getDefaultBinding(),
				countChildrenBlocks	    = binding.get('countChildren'),
				school                  = this.props.school;

		const child = binding.sub('childrenForm').meta().toJS('child') && binding.sub('childrenForm').meta().toJS('child')[index]
			? binding.sub('childrenForm').meta().toJS('child')[index] : undefined;

		return (
			<FormBlock
				isShowCloseButton	= { countChildrenBlocks > 1 }
				onClickClose		= { this.onClickDeleteChildItem.bind(this, index) }
				key 				= {`child_block_${index}`}
			>
				<FormField
					type        = "text"
					field       = {`child.${index}.firstName`}
					key         = {`child_${index}${countChildrenBlocks}_firstName`}
					validation  = "text"
				>
					First name
				</FormField>
				<FormField
					type        = "text"
					field       = {`child.${index}.lastName`}
					key         = {`child_${index}${countChildrenBlocks}_lastName`}
					validation  = "text"
				>
					Surname
				</FormField>
				<FormField
					type		    = "select"
					field			= {`child.${index}.gender`}
					key 			= {`child_${index}${countChildrenBlocks}_gender`}
					sourceArray	    = { this.getGender() }
					isVisible       = { school.additionalPermissionRequestFields.childGender !== ADDITIONAL_FIELD_CONDITION.HIDDEN }
				>
					Gender
				</FormField>
				<FormField
					type		= 'date'
					field		= {`child.${index}.birthday`}
					key 		= {`child_${index}${countChildrenBlocks}_birthday`}
					validation	= {`birthday`}
					isVisible   = { school.additionalPermissionRequestFields.childDateOfBirth !== ADDITIONAL_FIELD_CONDITION.HIDDEN }
				>
					Date of birth
				</FormField>
				<FormField
					type			= 'autocomplete'
					serviceFullData	= { this.getClassService() }
					field			= {`child.${index}.formId`}
					key 			= {`child_${index}${countChildrenBlocks}_formId`}
					defaultItem		= { child && child.formId ? child.formId.fullValue : undefined }
					isVisible       = { school.additionalPermissionRequestFields.childForm !== ADDITIONAL_FIELD_CONDITION.HIDDEN }
				>
					Form
				</FormField>
				<FormField
					type			= 'autocomplete'
					serviceFullData	= { this.getHouseService() }
					field			= {`child.${index}.houseId`}
					key 			= {`child_${index}${countChildrenBlocks}_houseId`}
					defaultItem		= { child && child.houseId ? child.houseId.fullValue : undefined }
					isVisible       = { school.additionalPermissionRequestFields.childHouse !== ADDITIONAL_FIELD_CONDITION.HIDDEN }
				>
					House
				</FormField>
			</FormBlock>
		);
	},

	convertChildrenDataToServerFormat: function(){
		const   childrenData = [],
				binding = this.getDefaultBinding(),
				childFields = [
		            'firstName',
		            'lastName',
		            'gender',
		            'birthday',
		            'formId',
		            'houseId'
		        ];

		const   children = binding.sub('childrenForm').meta().toJS('child'),
				childrenArray = Object.keys(children).map(key => children[key]);

		childrenArray.map(child => {
			const emptyChildren = {};

			childFields.forEach(field => {
				const value = child[field] ? child[field].value : undefined;
				if(typeof value !== 'undefined' && value !== '') {
					emptyChildren[field] = value;
				}
			});

			if(Object.keys(emptyChildren).length > 0) {
				childrenData.push(emptyChildren);
			}
		});

		return childrenData;
	},

	render: function() {
		const binding = this.getDefaultBinding();

		return (
			<Form
				binding				= {binding.sub('childrenForm')}
				onSubmit			= {this.onSubmit}
				onCancel			= {this.props.handleClickBack}
				rejectButtonText	= 'Back'
				defaultButton       = 'Finish'
			>
				{ this.renderChildren() }
			</Form>
		);
	}
});