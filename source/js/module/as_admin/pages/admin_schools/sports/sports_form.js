const   Form				= require('module/ui/form/form'),
		FormField			= require('module/ui/form/form_field'),
		FormColumn			= require('module/ui/form/form_column'),
		FormBlock			= require('module/ui/form/form_block/form_block'),
		classNames			= require('classnames'),
		SportsHelpers		= require('module/as_admin/pages/admin_schools/sports/sports_helpers'),
		FormElementManager	= require('module/ui/form/form_element_manager'),
		FormTitle			= require('module/ui/form/form_title'),
		{SVG}				= require('module/ui/svg'),
		Immutable			= require('immutable'),
		Morearty			= require('morearty'),
		React				= require('react');

const SportsForm = React.createClass({
	mixins: [Morearty.Mixin],
	propTypes: {
		title:          React.PropTypes.string.isRequired,
		onFormSubmit:   React.PropTypes.func
	},
	getPositionFields: function() {
		const self    = this,
			  data = self.getDefaultBinding().meta().toJS();

		let positionFields = [];

		if(data !== undefined && data.field !== undefined && data.field.value !== undefined) {
			let index = 0;
			data.field.value.positions.forEach(position => {
				positionFields.push(
					<FormBlock onClickClose={self.onRemovePosition.bind(self, index)}>
						<div className='eForm_field'>
							<div className='eForm_fieldName'>
								Name
							</div>
							<div className={classNames('eForm_fieldSet', {mInvalid: position.nameError})}>
								<input  type='text'
										key={'position-name-' + index}
										value={position.name}
										placeholder='Enter position name'
										onChange={self.onChangeNamePosition.bind(self, index)}/>
								<div    className='eForm_fieldValidText'
										title={position.nameError || ''}
										dangerouslySetInnerHTML={{__html: '&#x26a0;'}}
								></div>
							</div>
						</div>
						<div className='eForm_field'>
							<div className={classNames('eForm_fieldSet', {mInvalid: position.descriptionError})}>
								<div className='eForm_fieldName'>
									Description
								</div>
								<input  type='text'
										key={'position-description-' + index}
										value={position.description}
										placeholder='Enter position description'
										onChange={self.onChangeDescriptionPosition.bind(self, index)}/>
								<div    className='eForm_fieldValidText'
										title={position.descriptionError || ''}
										dangerouslySetInnerHTML={{__html: '&#x26a0;'}}
								></div>
							</div>
						</div>
					</FormBlock>
				);
				index++;
			});
		}
		positionFields.push(
			<FormElementManager
				text	= { 'Add new position item' }
				onClick	= { this.onAddNewPosition }
			/>
		);

		return positionFields;
	},
	getDisciplineFields: function() {
		const self    = this,
			data = self.getDefaultBinding().meta().toJS();

		let disciplineFields = [];

		if(data !== undefined && data.discipline !== undefined && data.discipline.value !== undefined) {
			let index = 0;
			data.discipline.value.forEach(disciplineItem => {
				disciplineFields.push(
					<FormBlock onClickClose={self.onRemoveDisciplineItem.bind(self, index)}>
						<div className='eForm_field'>
							<div className='eForm_fieldName'>
								Name
							</div>
							<div className={classNames('eForm_fieldSet', {mInvalid: disciplineItem.nameError})}>
								<input  type='text'
										key={'discipline-item-name' + index}
										value={disciplineItem.name}
										placeholder='Enter discipline name'
										onChange={self.onChangeNameDiscipline.bind(self, index)}/>
								<div    className='eForm_fieldValidText'
										title={disciplineItem.nameError || ''}
										dangerouslySetInnerHTML={{__html: '&#x26a0;'}}
								></div>
							</div>
						</div>
						<div className='eForm_field'>
							<div className='eForm_fieldName'>
								Plural name
							</div>
							<div className={classNames('eForm_fieldSet', {mInvalid: disciplineItem.namePluralError})}>
								<input  type='text'
										key={'discipline-item-name-plural' + index}
										value={disciplineItem.namePlural}
										placeholder='Enter discipline plural name'
										onChange={self.onChangeNamePluralDiscipline.bind(self, index)}/>
								<div    className='eForm_fieldValidText'
										title={disciplineItem.namePluralError || ''}
										dangerouslySetInnerHTML={{__html: '&#x26a0;'}}
								></div>
							</div>
						</div>
						<div className='eForm_field'>
							<div className='eForm_fieldName'>
								Description
							</div>
							<div className={classNames('eForm_fieldSet', {mInvalid: disciplineItem.descriptionError})}>
								<input  type='text'
										key={'discipline-item-description' + index}
										value={disciplineItem.description}
										placeholder='Enter discipline description'
										onChange={self.onChangeDescriptionDiscipline.bind(self, index)}/>
								<div    className='eForm_fieldValidText'
										title={disciplineItem.descriptionError || ''}
										dangerouslySetInnerHTML={{__html: '&#x26a0;'}}
								></div>
							</div>
						</div>
					</FormBlock>
				);
				index++;
			});
		}
		disciplineFields.push(
			<FormElementManager
				text	= { 'Add new discipline item' }
				onClick	= { this.onAddNewDisciplineItem }
			/>
		);

		return disciplineFields;
	},
	getPerformanceFields: function() {
		const   self    = this,
				data = self.getDefaultBinding().meta().toJS();

		let performanceFields = [];

		if(data !== undefined && data.performance !== undefined && data.performance.value !== undefined) {
			let index = 0;
			data.performance.value.forEach(performanceItem => {
				performanceFields.push(
					<FormBlock onClickClose={self.onRemovePerformanceItem.bind(self, index)}>
						<div className='eForm_field'>
							<div className='eForm_fieldName'>
								Item name
							</div>
							<div className={classNames('eForm_fieldSet', {mInvalid: performanceItem.nameError})}>
								<input  type='text'
										key={'performance-item-name-' + index}
										value={performanceItem.name}
										placeholder='Enter performance item name'
										onChange={self.onChangeNamePerformanceItem.bind(self, index)}/>
								<div    className='eForm_fieldValidText'
										title={performanceItem.namePluralError || ''}
										dangerouslySetInnerHTML={{__html: '&#x26a0;'}}
								></div>
							</div>
						</div>
						<div className='eForm_field'>
							<div className='eForm_fieldName'>
								Min value
							</div>
							<div className={classNames('eForm_fieldSet', {mInvalid: performanceItem.minValueError})}>
								<input  type='text'
										key={'performance-item-min-value-' + index}
										value={performanceItem.minValue}
										placeholder='Enter performance item min value'
										onChange={self.onChangeMinValuePerformanceItem.bind(self, index)}/>
								<div    className='eForm_fieldValidText'
										title={performanceItem.minValueError || ''}
										dangerouslySetInnerHTML={{__html: '&#x26a0;'}}
								></div>
							</div>
						</div>
						<div className='eForm_field'>
							<div className='eForm_fieldName'>
								Max value
							</div>
							<div className={classNames('eForm_fieldSet', {mInvalid: performanceItem.maxValueError})}>
								<input  type='text'
										key={'performance-item-max-value-' + index}
										value={performanceItem.maxValue}
										placeholder='Enter performance item max value'
										onChange={self.onChangeMaxValuePerformanceItem.bind(self, index)}/>
								<div    className='eForm_fieldValidText'
										title={performanceItem.maxValueError || ''}
										dangerouslySetInnerHTML={{__html: '&#x26a0;'}}
								></div>
							</div>
						</div>
					</FormBlock>
				);
				index++;
			});
		}
		performanceFields.push(
			<FormElementManager
				text	= { 'Add new performance item' }
				onClick	= { this.onAddNewPerformanceItem }
			/>
		);

		return performanceFields;
	},
	onAddNewPosition: function() {
		const   self     = this,
				binding  = self.getDefaultBinding(),
				data     = binding.meta().toJS();

		if(data.field.value.positions === undefined) {
			data.field.value.positions = [];
		}
		data.field.value.positions.push({
			name:           '',
			description:    ''
		});
		binding.meta().set('field', Immutable.fromJS(data.field));
	},
	onAddNewPerformanceItem: function() {
		const   self     = this,
				binding  = self.getDefaultBinding(),
				data     = binding.meta().toJS();

		if(data.performance.value === undefined) {
			data.performance.value = [];
		}
		data.performance.value.push({
			name:       '',
			minValue:   '',
			maxValue:   ''
		});
		binding.meta().set('performance', Immutable.fromJS(data.performance));
	},
	onAddNewDisciplineItem: function() {
		const   self     = this,
				binding  = self.getDefaultBinding(),
				data     = binding.meta().toJS();

		if(data.discipline.value === undefined) {
			data.discipline.value = [];
		}
		data.discipline.value.push({
			name:           '',
			namePlural:     '',
			description:    ''
		});
		binding.meta().set('discipline', Immutable.fromJS(data.discipline));
	},
	onRemoveDisciplineItem: function(id) {
		const   self     = this,
				binding  = self.getDefaultBinding();

		const data = binding.meta().toJS();

		data.discipline.value.splice(id, 1);
		binding.meta().set('discipline', Immutable.fromJS(data.discipline));
	},
	onRemovePosition: function(id) {
		const   self     = this,
				binding  = self.getDefaultBinding();

		const data = binding.meta().toJS();

		data.field.value.positions.splice(id, 1);
		binding.meta().set('field', Immutable.fromJS(data.field));
	},
	onChangeNamePosition: function(id, descriptor) {
		const self     = this,
			  binding  = self.getDefaultBinding(),
			  data     = binding.meta().toJS();

		const validationResult = SportsHelpers.validate('position name', descriptor.target.value, true, 'text');
		data.field.value.positions[id].nameError = validationResult;

		data.field.value.positions[id].name = descriptor.target.value;
		binding.meta().set('field', Immutable.fromJS(data.field));
	},
	onChangeDescriptionPosition: function(id, descriptor) {
		const   self     = this,
				binding  = self.getDefaultBinding(),
				data     = binding.meta().toJS();

		const validationResult = SportsHelpers.validate('position descriptionError', descriptor.target.value, false, 'text');
		data.field.value.positions[id].descriptionError     = validationResult;

		data.field.value.positions[id].description = descriptor.target.value;
		binding.meta().set('field', Immutable.fromJS(data.field));
	},
	onChangeNameDiscipline: function(id, descriptor) {
		const   self     = this,
				binding  = self.getDefaultBinding(),
				data     = binding.meta().toJS();

		const validationResult = SportsHelpers.validate('discipline name', descriptor.target.value, true, 'text');
		data.discipline.value[id].nameError = validationResult;

		data.discipline.value[id].name = descriptor.target.value;
		binding.meta().set('discipline', Immutable.fromJS(data.discipline));
	},
	onChangeNamePluralDiscipline: function(id, descriptor) {
		const   self     = this,
			binding  = self.getDefaultBinding(),
			data     = binding.meta().toJS();

		const validationResult = SportsHelpers.validate('discipline plural name', descriptor.target.value, true, 'text');
		data.discipline.value[id].namePluralError   = validationResult;

		data.discipline.value[id].namePlural = descriptor.target.value;
		binding.meta().set('discipline', Immutable.fromJS(data.discipline));
	},
	onChangeDescriptionDiscipline: function(id, descriptor) {
		const   self     = this,
				binding  = self.getDefaultBinding(),
				data     = binding.meta().toJS();

		const validationResult = SportsHelpers.validate('discipline description', descriptor.target.value, false, 'text');
		data.discipline.value[id].descriptionError   = validationResult;

		data.discipline.value[id].description = descriptor.target.value;
		binding.meta().set('discipline', Immutable.fromJS(data.discipline));
	},
	onChangeNamePerformanceItem: function(id, descriptor) {
		const   self     = this,
				binding  = self.getDefaultBinding(),
				data     = binding.meta().toJS();

		const validationResult = SportsHelpers.validate('performance name', descriptor.target.value, true, 'text');
		data.performance.value[id].nameError    = validationResult;

		data.performance.value[id].name = descriptor.target.value;
		binding.meta().set('performance', Immutable.fromJS(data.performance));
	},
	onChangeMinValuePerformanceItem: function(id, descriptor) {
		const   self     = this,
				binding  = self.getDefaultBinding(),
				data     = binding.meta().toJS();

		const validationResult = SportsHelpers.validate('performance minValue', descriptor.target.value, false, 'number');
		data.performance.value[id].minValueError    = validationResult;

		data.performance.value[id].minValue = descriptor.target.value;
		binding.meta().set('performance', Immutable.fromJS(data.performance));
	},
	onChangeMaxValuePerformanceItem: function(id, descriptor) {
		const   self     = this,
				binding  = self.getDefaultBinding(),
				data     = binding.meta().toJS();

		const validationResult = SportsHelpers.validate('performance maxValue', descriptor.target.value, false, 'number');
		data.performance.value[id].maxValueError    = validationResult;

		data.performance.value[id].maxValue = descriptor.target.value;
		binding.meta().set('performance', Immutable.fromJS(data.performance));
	},
	onRemovePerformanceItem: function(id) {
		const   self     = this,
				binding  = self.getDefaultBinding();

		const data = binding.meta().toJS();

		data.performance.value.splice(id, 1);
		binding.meta().set('performance', Immutable.fromJS(data.performance));
	},
	onSelectPlayers: function (value) {
		const 	binding 			= this.getDefaultBinding(),
				isPresenceOnly		= binding.meta().get('pointsDisplay.value') === SportsHelpers.pointsDisplayServerToClientMap['PRESENCE_ONLY'],
				isIndividualType 	= binding.meta().get('players.value') === 'Individual';

		if (!isIndividualType && isPresenceOnly) {
			binding.meta().set('pointsDisplay.value', 'plain');
		}
		binding.meta().set('players.value', value);

		return value;
	},
	render: function() {
		const 	self    					= this,
				binding 					= self.getDefaultBinding(),
				pointsDisplay 				= binding.meta().get('pointsDisplay.value'),
				isIndividualType 			= binding.meta().get('players.value') === 'Individual',
				optionsPoint				= isIndividualType ? SportsHelpers.clientPointDisplayArray
												: SportsHelpers.clientPointDisplayArray.filter(p => p !== SportsHelpers.pointsDisplayServerToClientMap['PRESENCE_ONLY']),
				showMask 					= pointsDisplay !== SportsHelpers.pointsDisplayServerToClientMap['PLAIN'] &&
					pointsDisplay !== SportsHelpers.pointsDisplayServerToClientMap['PRESENCE_ONLY'];

		// This comment about field 'positions'
		// As you can see - container for this field is <div> instead <FormField>.
		// Unfortunately, our Form Component can't handle <FormField> that is array.
		// However, positions field  just so and is. So i use some dirty trick.
		// I make position field as <div> element and implement changes handler by hands(see functions onChangePosition, onAddNewPosition).
		// Also i add property 'field' to this element - in this case Form Component read positions data and set this data to meta,
		// but Form Component can't handle changes.
		return (
			<div>
				<div className='container'>
					<Form
							formTitleClass	= { 'bFormTitle' }
							name			= { self.props.title }
							onSubmit		= { self.props.onFormSubmit }
							binding			= { binding }
							formStyleClass	= 'mWide row'
					>
						<FormColumn customStyle='col-md-4'>
							<FormTitle text={'Summary'}/>
							<FormBlock isShowCloseButton={false}>
								<FormField
									type		= 'text'
									field		= 'name'
									validation	= 'required'
								>
									Sport name
								</FormField>
								<FormField
									type	= 'text'
									field	= 'description'
								>
									Description
								</FormField>
								<FormField
									field	= 'scoring'
									options	= { SportsHelpers.clientScoringArray }
									type	= 'dropdown'
								>
									Scoring
								</FormField>
								<FormField
									field		= 'players'
									options		= { SportsHelpers.clientPlayersArray }
									onSelect 	= { this.onSelectPlayers }
									type		= 'dropdown'
								>
									Type of players
								</FormField>
								<FormField
									classNames	= 'mWideSingleLine'
									type		= 'checkbox'
									field		= 'individualResultsAvailable'
								>
									Is individual results available
								</FormField>
								<FormField
									classNames	= 'mWideSingleLine'
									type		= 'checkbox'
									field		= 'multiparty'
								>
									Is several teams available
								</FormField>
							</FormBlock>

							<FormTitle text={'Game Field Picture'}/>
							<FormField labelText='Upload Game Field Picture' type='imageFile' field='fieldPic'/>

							<FormTitle text={'Sport Icon'}/>
							<FormField labelText='Upload Game Icon' type='imageFile' field='icon'/>
						</FormColumn>

						<FormColumn customStyle='col-md-4'>
							<FormTitle text={'Limits'}/>
							<FormBlock isShowCloseButton={false}>
								<FormField type='text'
										   field='minPlayers'
									>
									Minimum players
								</FormField>
								<FormField type='text'
										   field='maxPlayers'
									>
									Maximum players
								</FormField>
								<FormField type='text'
										   field='minSubs'
									>
									Minimum substitutions
								</FormField>
								<FormField type='text'
										   field='maxSubs'
									>
									Maximum substitutions
								</FormField>
							</FormBlock>

							<FormTitle text={'Genders'}/>
							<FormBlock isShowCloseButton={false}>
								<FormField
									classNames	= 'mWideSingleLine'
									type		= 'checkbox'
									field		= 'genders.maleOnly'
								>
									Boys
								</FormField>
								<FormField
									classNames	= 'mWideSingleLine'
									type		= 'checkbox'
									field		= 'genders.femaleOnly'
								>
									Girls
								</FormField>
								<FormField
									classNames	= 'mWideSingleLine'
									type		= 'checkbox'
									field		= 'genders.mixed'
								>
									Mixed
								</FormField>
							</FormBlock>

							<FormTitle text={'Points'}/>
							<FormBlock isShowCloseButton={false}>
								<FormField type='text'
										   field='pointsName'
										   validation='required'
									>
									Points name
								</FormField>
								<FormField type='text'
										   field='pointsNamePlural'
										   validation='required'
									>
									Points name plural
								</FormField>
								<FormField type='text'
										   field='pointsStep'
										   validation='required number'
									>
									Points step
								</FormField>
								<FormField field='pointsDisplay'
										   options={optionsPoint}
										   type='dropdown'
									>
									How to display points
								</FormField>
								<FormField type='text'
										   field='pointsInputMask'
										   validation='required'
										   condition={showMask}
									>
									Points input mask
								</FormField>
							</FormBlock>
						</FormColumn>

						<FormColumn customStyle='col-md-4'>
							<FormTitle text={'Positions'}/>
							<div field='field'>
								{self.getPositionFields()}
							</div>
							<FormTitle text={'Discipline'}/>
							<div field='discipline'>
								{self.getDisciplineFields()}
							</div>
							<FormTitle text={'Performance'}/>
							<div field='performance'>
								{self.getPerformanceFields()}
							</div>
						</FormColumn>
					</Form>
				</div>
			</div>
		)
	}
});

module.exports = SportsForm;
