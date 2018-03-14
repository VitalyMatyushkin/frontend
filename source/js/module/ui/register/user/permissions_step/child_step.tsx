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

const MAX_COUNT_CHILDREN = 10;

export const ChildStep = (React as any).createClass({
	mixins: [Morearty.Mixin],

	componentWillMount: function() {
		this.initCountChildren();
	},

	componentWillUnmount: function() {
		this.getDefaultBinding().sub('childrenForm').clear();
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
			const childrenDataToServer = this.convertChildrenDataToServerFormat(data);
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
			if (typeof binding.toJS(`child_${index}_firstName`).value === 'undefined' || binding.toJS(`child_${index}_firstName`).value === '')
			{
				binding.set(`child_${index}_firstName`, Immutable.fromJS(fieldData));
				countError ++;
			}

			if (typeof binding.toJS(`child_${index}_lastName`).value === 'undefined' || binding.toJS(`child_${index}_lastName`).value === '')
			{
				binding.set(`child_${index}_lastName`, Immutable.fromJS(fieldData));
				countError ++;
			}

			if (school.additionalPermissionRequestFields.childDateOfBirth === ADDITIONAL_FIELD_CONDITION.REQUIRED &&
				(typeof binding.toJS(`child_${index}_birthday`).value === 'undefined' || binding.toJS(`child_${index}_birthday`).value === ''))
			{
				binding.set(`child_${index}_birthday`, Immutable.fromJS(fieldData));
				countError ++;
			}

			if (school.additionalPermissionRequestFields.childGender === ADDITIONAL_FIELD_CONDITION.REQUIRED &&
				(typeof binding.toJS(`child_${index}_gender`).value === 'undefined' || binding.toJS(`child_${index}_gender`).value === ''))
			{
				const genderField = binding.toJS(`child_${index}_gender`);
				(genderField as any).showError = true;
				binding.set(`child_${index}_gender`, Immutable.fromJS(genderField));
				countError ++;
			}

			if (school.additionalPermissionRequestFields.childForm === ADDITIONAL_FIELD_CONDITION.REQUIRED &&
				(typeof binding.toJS(`child_${index}_formId`).value === 'undefined' || binding.toJS(`child_${index}_formId`).value === ''))
			{
				binding.set(`child_${index}_formId`, Immutable.fromJS(fieldData));
				countError ++;
			}

			if (school.additionalPermissionRequestFields.childHouse === ADDITIONAL_FIELD_CONDITION.REQUIRED &&
				(typeof binding.toJS(`child_${index}_houseId`).value === 'undefined' || binding.toJS(`child_${index}_houseId`).value === ''))
			{
				binding.set(`child_${index}_houseId`, Immutable.fromJS(fieldData));
				countError ++;
			}
		}

		return countError;
	},

	renderChildren: function() {
		const   binding = this.getDefaultBinding(),
			countChildren	= binding.get('countChildren');
		const children = [];

		for(let i = 0; i < MAX_COUNT_CHILDREN; i++) {
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
		if (this.getDefaultBinding().get('countChildren') < MAX_COUNT_CHILDREN) {
			return (
				<FormElementManager
					text={'Add new "Child" item'}
					onClick={this.onClickAddChildItem}
					id={'add_child'}
				/>
			);
		} else {
			return <div></div>;
		}
	},

	onClickAddChildItem: function() {
		const	binding			= this.getDefaultBinding(),
				countChildren	= binding.get('countChildren');

		binding.set('countChildren', countChildren + 1);
	},
	onClickDeleteChildItem: function(index) {
		const	binding			= this.getDefaultBinding(),
			countChildren	= binding.get('countChildren');

		binding.set('countChildren', countChildren - 1);

		this.clearChildByIndex(index);
	},

	clearChildByIndex: function(index) {
		const binding = this.getDefaultBinding().sub('childrenForm');

		const fieldData = {
			active:	true,
			error:	false,
			value:	''
		};

		binding.meta()
			.atomically()
			.set(`child_${index}_firstName`,	Immutable.fromJS(fieldData))
			.set(`child_${index}_lastName`,		Immutable.fromJS(fieldData))
			.set(`child_${index}_gender`,		Immutable.fromJS(fieldData))
			.set(`child_${index}_birthday`,		Immutable.fromJS(fieldData))
			.set(`child_${index}_formId`,	    Immutable.fromJS(fieldData))
			.set(`child_${index}_houseId`,	    Immutable.fromJS(fieldData))
			.commit();
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

		const	isVisible				= index < countChildrenBlocks;

		return (
			<FormBlock
				isVisible			= { isVisible }
				isShowCloseButton	= { index !==0 && index === countChildrenBlocks-1 }
				onClickClose		= { this.onClickDeleteChildItem.bind(this, index) }
				key 				= {`child_block_${index}`}
			>
				<FormField
					type        = "text"
					field       = {`child_${index}_firstName`}
					validation  = "text"
				>
					Child’s name
				</FormField>
				<FormField
					type        = "text"
					field       = {`child_${index}_lastName`}
					validation  = "text"
				>
					Child’s surname
				</FormField>
				<FormField
					type		    = "select"
					field			= {`child_${index}_gender`}
					sourceArray	    = { this.getGender() }
					isVisible       = { school.additionalPermissionRequestFields.childGender !== ADDITIONAL_FIELD_CONDITION.HIDDEN }
				>
					Gender
				</FormField>
				<FormField
					type		= 'date'
					field		= {`child_${index}_birthday`}
					validation	= {`birthday`}
					isVisible   = { school.additionalPermissionRequestFields.childDateOfBirth !== ADDITIONAL_FIELD_CONDITION.HIDDEN }
				>
					Date of birth
				</FormField>
				<FormField
					type			= 'autocomplete'
					serviceFullData	= { this.getClassService() }
					field			= {`child_${index}_formId`}
					defaultItem		= { this.props.initialForm }
					isVisible       = { school.additionalPermissionRequestFields.childForm !== ADDITIONAL_FIELD_CONDITION.HIDDEN }
				>
					Form
				</FormField>
				<FormField
					type			= 'autocomplete'
					serviceFullData	= { this.getHouseService() }
					field			= {`child_${index}_houseId`}
					defaultItem		= { this.props.initialHouse }
					isVisible       = { school.additionalPermissionRequestFields.childHouse !== ADDITIONAL_FIELD_CONDITION.HIDDEN }
				>
					House
				</FormField>
			</FormBlock>
		);
	},

	convertChildrenDataToServerFormat: function(data){
		const   childrenData = [],
				countChildrenBlocks = this.getDefaultBinding().get('countChildren'),
				childFields = [
					'firstName',
					'lastName',
					'gender',
					'birthday',
					'formId',
					'houseId'
				];

		for(let index = 0; index < countChildrenBlocks; index++) {
			const emptyChildren = {};

			childFields.forEach(field => {
				const value = data[`child_${index}_${field}`];

				if(typeof value !== 'undefined' && value !== '') {
					emptyChildren[field] = value;
					// it's a little trick - delete old form data
					// because this should not be in post data
					data[`child_${index}_${field}`] = undefined;
				}

			});

			if(Object.keys(emptyChildren).length > 0) {
				childrenData.push(emptyChildren);
			}
		}

		data.children = childrenData;
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