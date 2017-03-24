const   Form            = require('module/ui/form/form'),
        FormField       = require('module/ui/form/form_field'),
        FormColumn      = require('module/ui/form/form_column'),
        FormBlock       = require('module/ui/form/form_block/form_block'),
        classNames      = require('classnames'),
        SportsHelpers   = require('module/as_admin/pages/admin_schools/sports/sports_helpers'),
        SVG             = require('module/ui/svg'),
        Immutable       = require('immutable'),
        Morearty        = require('morearty'),
        React           = require('react');

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
                    <div className="eForm_placeholder">
                        <div className="eForm_field">
                            <div className="eForm_fieldName">
                                Name
                            </div>
                            <div className={classNames('eForm_fieldSet', {mInvalid: position.nameError})}>
                                <input  type="text"
                                        key={'position-name-' + index}
                                        value={position.name}
                                        placeholder="Enter position name"
                                        onChange={self.onChangeNamePosition.bind(self, index)}/>
                                <div    className='eForm_fieldValidText'
                                        title={position.nameError || ''}
                                        dangerouslySetInnerHTML={{__html: '&#x26a0;'}}
                                ></div>
                            </div>
                        </div>
                        <div className="eForm_field">
                            <div className={classNames('eForm_fieldSet', {mInvalid: position.descriptionError})}>
                                <div className="eForm_fieldName">
                                    Description
                                </div>
                                <input  type="text"
                                        key={'position-description-' + index}
                                        value={position.description}
                                        placeholder="Enter position description"
                                        onChange={self.onChangeDescriptionPosition.bind(self, index)}/>
                                <div    className='eForm_fieldValidText'
                                        title={position.descriptionError || ''}
                                        dangerouslySetInnerHTML={{__html: '&#x26a0;'}}
                                ></div>
                            </div>
                        </div>
                        <div    className="bButton mRight"
                                onClick={self.onRemovePosition.bind(self, index)}
                        >
                            Remove
                        </div>
                    </div>
                );
                index++;
            });
        }
        positionFields.push(
            <div className="eForm_placeholder">
                <div className="eForm_fieldName mMarginLeft mMarginTop">
                    Add new position item
                </div>
                <div    className="eForm_addButtonWrapper"
                        onClick={self.onAddNewPosition}
                >
                    <SVG    classes="eForm_addButton"
                            icon="icon_add_photo"
                    />
                </div>
            </div>
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
                    <div className="eForm_placeholder">
                        <div className="eForm_field">
                            <div className="eForm_fieldName">
                                Name
                            </div>
                            <div className={classNames('eForm_fieldSet', {mInvalid: disciplineItem.nameError})}>
                                <input  type="text"
                                        key={'discipline-item-name' + index}
                                        value={disciplineItem.name}
                                        placeholder="Enter discipline name"
                                        onChange={self.onChangeNameDiscipline.bind(self, index)}/>
                                <div    className='eForm_fieldValidText'
                                        title={disciplineItem.nameError || ''}
                                        dangerouslySetInnerHTML={{__html: '&#x26a0;'}}
                                ></div>
                            </div>
                        </div>
                        <div className="eForm_field">
                            <div className="eForm_fieldName">
                                Plural name
                            </div>
                            <div className={classNames('eForm_fieldSet', {mInvalid: disciplineItem.namePluralError})}>
                                <input  type="text"
                                        key={'discipline-item-name-plural' + index}
                                        value={disciplineItem.namePlural}
                                        placeholder="Enter discipline plural name"
                                        onChange={self.onChangeNamePluralDiscipline.bind(self, index)}/>
                                <div    className='eForm_fieldValidText'
                                        title={disciplineItem.namePluralError || ''}
                                        dangerouslySetInnerHTML={{__html: '&#x26a0;'}}
                                ></div>
                            </div>
                        </div>
                        <div className="eForm_field">
                            <div className="eForm_fieldName">
                                Description
                            </div>
                            <div className={classNames('eForm_fieldSet', {mInvalid: disciplineItem.descriptionError})}>
                                <input  type="text"
                                        key={'discipline-item-description' + index}
                                        value={disciplineItem.description}
                                        placeholder="Enter discipline description"
                                        onChange={self.onChangeDescriptionDiscipline.bind(self, index)}/>
                                <div    className='eForm_fieldValidText'
                                        title={disciplineItem.descriptionError || ''}
                                        dangerouslySetInnerHTML={{__html: '&#x26a0;'}}
                                ></div>
                            </div>
                        </div>
                        <div    className="bButton mRight"
                                onClick={self.onRemoveDisciplineItem.bind(self, index)}
                        >
                            Remove
                        </div>
                    </div>
                );
                index++;
            });
        }
        disciplineFields.push(
            <div className="eForm_placeholder">
                <div className="eForm_fieldName mMarginLeft mMarginTop">
                    Add new discipline item
                </div>
                <div    className="eForm_addButtonWrapper"
                        onClick={self.onAddNewDisciplineItem}
                >
                    <SVG    classes="eForm_addButton"
                            icon="icon_add_photo"
                    />
                </div>
            </div>
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
                    <div className="eForm_placeholder">
                        <div className="eForm_field">
                            <div className="eForm_fieldName">
                                Item name
                            </div>
                            <div className={classNames('eForm_fieldSet', {mInvalid: performanceItem.nameError})}>
                                <input  type="text"
                                        key={'performance-item-name-' + index}
                                        value={performanceItem.name}
                                        placeholder="Enter performance item name"
                                        onChange={self.onChangeNamePerformanceItem.bind(self, index)}/>
                                <div    className='eForm_fieldValidText'
                                        title={performanceItem.namePluralError || ''}
                                        dangerouslySetInnerHTML={{__html: '&#x26a0;'}}
                                ></div>
                            </div>
                        </div>
                        <div className="eForm_field">
                            <div className="eForm_fieldName">
                                Min value
                            </div>
                            <div className={classNames('eForm_fieldSet', {mInvalid: performanceItem.minValueError})}>
                                <input  type="text"
                                        key={'performance-item-min-value-' + index}
                                        value={performanceItem.minValue}
                                        placeholder="Enter performance item min value"
                                        onChange={self.onChangeMinValuePerformanceItem.bind(self, index)}/>
                                <div    className='eForm_fieldValidText'
                                        title={performanceItem.minValueError || ''}
                                        dangerouslySetInnerHTML={{__html: '&#x26a0;'}}
                                ></div>
                            </div>
                        </div>
                        <div className="eForm_field">
                            <div className="eForm_fieldName">
                                Max value
                            </div>
                            <div className={classNames('eForm_fieldSet', {mInvalid: performanceItem.maxValueError})}>
                                <input  type="text"
                                        key={'performance-item-max-value-' + index}
                                        value={performanceItem.maxValue}
                                        placeholder="Enter performance item max value"
                                        onChange={self.onChangeMaxValuePerformanceItem.bind(self, index)}/>
                                <div    className='eForm_fieldValidText'
                                        title={performanceItem.maxValueError || ''}
                                        dangerouslySetInnerHTML={{__html: '&#x26a0;'}}
                                ></div>
                            </div>
                        </div>
                        <div    className="bButton mRight"
                                onClick={self.onRemovePerformanceItem.bind(self, index)}
                        >
                            Remove
                        </div>
                    </div>
                );
                index++;
            });
        }
        performanceFields.push(
            <div className="eForm_placeholder">
                <div className="eForm_fieldName mMarginLeft mMarginTop">
                    Add new performance item
                </div>
                <div    className="eForm_addButtonWrapper"
                        onClick={self.onAddNewPerformanceItem}
                >
                    <SVG    classes="eForm_addButton"
                            icon="icon_add_photo"
                    />
                </div>
            </div>
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
        binding.meta().set("field", Immutable.fromJS(data.field));
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
        binding.meta().set("performance", Immutable.fromJS(data.performance));
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
        binding.meta().set("discipline", Immutable.fromJS(data.discipline));
    },
    onRemoveDisciplineItem: function(id) {
        const   self     = this,
                binding  = self.getDefaultBinding();

        const data = binding.meta().toJS();

        data.discipline.value.splice(id, 1);
        binding.meta().set("discipline", Immutable.fromJS(data.discipline));
    },
    onRemovePosition: function(id) {
        const   self     = this,
                binding  = self.getDefaultBinding();

        const data = binding.meta().toJS();

        data.field.value.positions.splice(id, 1);
        binding.meta().set("field", Immutable.fromJS(data.field));
    },
    onChangeNamePosition: function(id, descriptor) {
        const self     = this,
              binding  = self.getDefaultBinding(),
              data     = binding.meta().toJS();

        const validationResult = SportsHelpers.validate("position name", descriptor.target.value, true, 'text');
        data.field.value.positions[id].nameError = validationResult;

        data.field.value.positions[id].name = descriptor.target.value;
        binding.meta().set("field", Immutable.fromJS(data.field));
    },
    onChangeDescriptionPosition: function(id, descriptor) {
        const   self     = this,
                binding  = self.getDefaultBinding(),
                data     = binding.meta().toJS();

        const validationResult = SportsHelpers.validate("position descriptionError", descriptor.target.value, false, 'text');
        data.field.value.positions[id].descriptionError     = validationResult;

        data.field.value.positions[id].description = descriptor.target.value;
        binding.meta().set("field", Immutable.fromJS(data.field));
    },
    onChangeNameDiscipline: function(id, descriptor) {
        const   self     = this,
                binding  = self.getDefaultBinding(),
                data     = binding.meta().toJS();

        const validationResult = SportsHelpers.validate("discipline name", descriptor.target.value, true, 'text');
        data.discipline.value[id].nameError = validationResult;

        data.discipline.value[id].name = descriptor.target.value;
        binding.meta().set("discipline", Immutable.fromJS(data.discipline));
    },
    onChangeNamePluralDiscipline: function(id, descriptor) {
        const   self     = this,
            binding  = self.getDefaultBinding(),
            data     = binding.meta().toJS();

        const validationResult = SportsHelpers.validate("discipline plural name", descriptor.target.value, true, 'text');
        data.discipline.value[id].namePluralError   = validationResult;

        data.discipline.value[id].namePlural = descriptor.target.value;
        binding.meta().set("discipline", Immutable.fromJS(data.discipline));
    },
    onChangeDescriptionDiscipline: function(id, descriptor) {
        const   self     = this,
                binding  = self.getDefaultBinding(),
                data     = binding.meta().toJS();

        const validationResult = SportsHelpers.validate("discipline description", descriptor.target.value, false, 'text');
        data.discipline.value[id].descriptionError   = validationResult;

        data.discipline.value[id].description = descriptor.target.value;
        binding.meta().set("discipline", Immutable.fromJS(data.discipline));
    },
    onChangeNamePerformanceItem: function(id, descriptor) {
        const   self     = this,
                binding  = self.getDefaultBinding(),
                data     = binding.meta().toJS();

        const validationResult = SportsHelpers.validate("performance name", descriptor.target.value, true, 'text');
        data.performance.value[id].nameError    = validationResult;

        data.performance.value[id].name = descriptor.target.value;
        binding.meta().set("performance", Immutable.fromJS(data.performance));
    },
    onChangeMinValuePerformanceItem: function(id, descriptor) {
        const   self     = this,
                binding  = self.getDefaultBinding(),
                data     = binding.meta().toJS();

        const validationResult = SportsHelpers.validate("performance minValue", descriptor.target.value, false, 'number');
        data.performance.value[id].minValueError    = validationResult;

        data.performance.value[id].minValue = descriptor.target.value;
        binding.meta().set("performance", Immutable.fromJS(data.performance));
    },
    onChangeMaxValuePerformanceItem: function(id, descriptor) {
        const   self     = this,
                binding  = self.getDefaultBinding(),
                data     = binding.meta().toJS();

        const validationResult = SportsHelpers.validate("performance maxValue", descriptor.target.value, false, 'number');
        data.performance.value[id].maxValueError    = validationResult;

        data.performance.value[id].maxValue = descriptor.target.value;
        binding.meta().set("performance", Immutable.fromJS(data.performance));
    },
    onRemovePerformanceItem: function(id) {
        const   self     = this,
                binding  = self.getDefaultBinding();

        const data = binding.meta().toJS();

        data.performance.value.splice(id, 1);
        binding.meta().set("performance", Immutable.fromJS(data.performance));
    },
    render: function() {
        const 	self    		= this,
              	binding 		= self.getDefaultBinding(),
				pointsDisplay 	= binding.meta().get('pointsDisplay.value'),
				showMask 		= pointsDisplay !== 'plain';

        // This comment about field "positions"
        // As you can see - container for this field is <div> instead <FormField>.
        // Unfortunately, our Form Component can't handle <FormField> that is array.
        // However, positions field  just so and is. So i use some dirty trick.
        // I make position field as <div> element and implement changes handler by hands(see functions onChangePosition, onAddNewPosition).
        // Also i add property "field" to this element - in this case Form Component read positions data and set this data to meta,
        // but Form Component can't handle changes.
        return (
            <div>
                <div className="container">
                    <Form name={self.props.title}
                          onSubmit={self.props.onFormSubmit}
                          binding={binding}
                          formStyleClass="mWide"
                          formStyleClass="row">
                        <FormColumn customStyle="col-md-5 col-md-offset-1">
                            <FormField type="text"
                                       field="name"
                                       validation="required"
                                >
                                Sport name
                            </FormField>
                            <FormField type="text"
                                       field="description"
                                >
                                Description
                            </FormField>
                            <FormField field="scoring"
                                       options={SportsHelpers.clientScoringArray}
                                       type="dropdown"
                                >
                                Scoring
                            </FormField>
                            <FormField field="players"
                                       options={SportsHelpers.clientPlayersArray}
                                       type="dropdown"
                                >
                                Type of players
                            </FormField>
                            <FormField type="checkbox"
                                       field="individualResultsAvailable"
                                >
                                Is individual results available
                            </FormField>

                            <div className="eForm_fieldName">Limits</div>
                            <FormBlock>
                                <FormField type="text"
                                           field="minPlayers"
                                    >
                                    Minimum players
                                </FormField>
                                <FormField type="text"
                                           field="maxPlayers"
                                    >
                                    Maximum players
                                </FormField>
                                <FormField type="text"
                                           field="minSubs"
                                    >
                                    Minimum substitutions
                                </FormField>
                                <FormField type="text"
                                           field="maxSubs"
                                    >
                                    Maximum substitutions
                                </FormField>
                            </FormBlock>

                            <div className="eForm_fieldName">Genders</div>
                            <FormBlock>
                                <FormField type="checkbox"
                                           field="genders.maleOnly"
                                    >
                                    Boys
                                </FormField>
                                <FormField type="checkbox"
                                           field="genders.femaleOnly"
                                    >
                                    Girls
                                </FormField>
                                <FormField type="checkbox"
                                           field="genders.mixed"
                                    >
                                    Mixed
                                </FormField>
                            </FormBlock>

                            <div className="eForm_fieldName">Points</div>
                            <FormBlock>
                                <FormField type="text"
                                           field="pointsName"
                                           validation="required"
                                    >
                                    Points name
                                </FormField>
                                <FormField type="text"
                                           field="pointsNamePlural"
                                           validation="required"
                                    >
                                    Points name plural
                                </FormField>
                                <FormField type="text"
                                           field="pointsStep"
                                           validation="required number"
                                    >
                                    Points step
                                </FormField>
                                <FormField field="pointsDisplay"
                                           options={SportsHelpers.clientPointDisplayArray}
                                           type="dropdown"
                                    >
                                    How to display points
                                </FormField>
                                <FormField type="text"
                                           field="pointsInputMask"
                                           validation="required"
                                           condition={showMask}
                                    >
                                    Points input mask
                                </FormField>
                            </FormBlock>

                            <div className="eForm_fieldName mMarginTop">Game Field Picture</div>
                            <FormField labelText="Upload Game Field Picture" type="imageFile" field="fieldPic"/>

                            <div className="eForm_fieldName mMarginTop">Sport Icon</div>
                            <FormField labelText="Upload Game Icon" type="imageFile" field="icon"/>
                        </FormColumn>
                        <FormColumn customStyle='mWithoutMargin col-md-5'>
                            <div className="eForm_fieldName">Positions</div>
                            <div field="field">
                                {self.getPositionFields()}
                            </div>
                            <div className="eForm_fieldName mMarginTop">Discipline</div>
                            <div field="discipline">
                                {self.getDisciplineFields()}
                            </div>
                            <div className="eForm_fieldName mMarginTop">Performance</div>
                            <div field="performance">
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
