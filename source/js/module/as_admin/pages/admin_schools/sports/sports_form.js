const   Form        = require('module/ui/form/form'),
        FormField   = require('module/ui/form/form_field'),
        FormColumn  = require('module/ui/form/form_column'),
        Immutable 	= require('immutable'),
        Morearty	= require('morearty'),
        React       = require('react');

const SportsForm = React.createClass({
    mixins: [Morearty.Mixin],
    propTypes: {
        title: React.PropTypes.string.isRequired,
        onFormSubmit: React.PropTypes.func
    },
    getGenderArray: function() {
        return [
            'boys',
            'girls',
            'girls and boys'
        ];
    },
    getGenders: function() {
        const self    = this,
              data = self.getDefaultBinding().toJS();

        return (data !== undefined && data.genders !== undefined) ? data.genders : null;
    },
    getPositionFields: function() {
        const self    = this,
              data = self.getDefaultBinding().meta().toJS();

        let positionFields = [];

        if(data !== undefined && data.positions !== undefined && data.positions.value !== undefined) {
            let index = 0;
            data.positions.value.forEach(position => {
                positionFields.push(
                    <div className="eForm_field">
                        <Morearty.DOM.input className='eForm_fieldInput'
                                            ref={'positions' + index}
                                            value={position}
                                            onChange={self.onChangePosition.bind(self,index)}/>
                    </div>
                );
                index++;
            });
        }
        positionFields.push(
            <div className="eForm_field">
                <Morearty.DOM.input className='eForm_fieldInput'
                                    ref='new_position'
                                    placeholder="Enter position"
                                    onChange={self.onAddNewPosition}/>
            </div>
        );

        return positionFields;
    },
    onAddNewPosition: function(event) {
        const self     = this,
            binding  = self.getDefaultBinding(),
            data     = binding.meta().toJS();

        if(data.positions.value === undefined) {
            data.positions.value = [];
        }
        data.positions.value.push(event.target.value);
        binding.meta().set("positions", Immutable.fromJS(data.positions));
    },
    onChangePosition: function(id, event) {
        const self     = this,
              binding  = self.getDefaultBinding(),
              data     = binding.meta().toJS();

        if(event.target.value === '') {
            data.positions.value.splice(id, 1);
            binding.meta().set("positions", Immutable.fromJS(data.positions));
        } else {
            data.positions.value[id] = event.target.value;
            binding.meta().set("positions", Immutable.fromJS(data.positions));
        }
    },
    render: function() {
        const self    = this,
              binding = self.getDefaultBinding();


        // This comment about field "positions"
        // As you can see - container for this field is <div> instead <FormField>.
        // Unfortunately, our Form Component can't handle <FormField> that is array.
        // However, positions field  just so and is. So i use some dirty trick.
        // I make position field as <div> element and implement changes handler by hands(see functions onChangePosition, onAddNewPosition).
        // Also i add property "field" to this element - in this case Form Component read positions data and set this data to meta,
        // but Form Component can't handle changes.
        return (
            <div>
                <Form name={self.props.title} onSubmit={self.props.onFormSubmit} binding={binding} >
                    <FormColumn>
                        <FormField type="text"
                                   field="name"
                                   validation="required">Sport name</FormField>
                        <FormField type="text"
                                   field="description">Description</FormField>
                        <FormField type="text"
                                   field="minPlayers">Minimum players</FormField>
                        <FormField type="text"
                                   field="maxPlayers">Maximum players</FormField>
                        <FormField type="text"
                                   field="maxSubs">Maximum substitutions</FormField>
                        <FormField field="genders"
                                   userProvidedOptions={self.getGenderArray()}
                                   userActiveState={self.getGenders()}
                                   type="dropdown">Genders</FormField>
                    </FormColumn>
                    <FormColumn>
                        <div className="eForm_fieldName">Positions</div>
                        <div field="positions">
                            {self.getPositionFields()}
                        </div>
                    </FormColumn>
                    <FormColumn>
                        <FormField labelText="Upload Game Field Picture" type="imageFile" typeOfFile="image" field="fieldPic"/>
                    </FormColumn>
                </Form>
            </div>
        )
    }
});

module.exports = SportsForm;
