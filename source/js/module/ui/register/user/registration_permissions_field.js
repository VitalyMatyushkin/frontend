/**
 * Created by bridark on 15/10/15.
 */
var AutoComplete = require('module/ui/autocomplete/autocomplete'),
    If = require('module/ui/if/if'),
    RegistrationPermissionField;
/*
 *
 *
 */
RegistrationPermissionField = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        isFormFilled:React.PropTypes.bool.isRequired,
        onSuccess:React.PropTypes.func.isRequired,
        fieldCounter:React.PropTypes.number.isRequired,
        onAnother: React.PropTypes.func.isRequired
    },
    /**
     * school filter by schoolName
     * @param schoolName
     * @returns {*}
     */
    serviceSchoolFilter: function(schoolName) {
        var self = this;

        return window.Server.getAllSchools.get();
    },
    /**
     * house filter by houseName
     * @param houseName
     * @returns {*}
     */
    serviceHouseFilter: function(houseName) {
        var self = this,
            binding = self.getDefaultBinding();

        return window.Server.houses.get(binding.get('schoolId'), {
            filter: {
                where: {
                    schoolId: binding.get('schoolId')
                }
            }
        });
    },
    /**
     * form filter by formName
     * @param formName
     * @returns {*}
     */
    serviceFormFilter: function(formName) {
        var self = this,
            binding = self.getDefaultBinding();

        return window.Server.forms.get(binding.get('schoolId'), {
            filter: {
                where: {
                    schoolId: binding.get('schoolId')
                }
            }
        });
    },
    onSelectSchool: function(schoolId) {
        var self = this,
            binding = self.getDefaultBinding();

        binding
            .atomically()
            .set('schoolId', schoolId)
            .commit();
    },
    onSelectHouse: function(houseId) {
        var self = this,
            binding = self.getDefaultBinding();

        window.Server.house.get(houseId).then(function(house) {
            binding
                .atomically()
                .set('houseId', houseId)
                .set('houseName', house.name)
                .commit();
        });

    },
    onSelectForm: function(formId) {
        var self = this,
            binding = self.getDefaultBinding();

        window.Server.form.get(formId).then(function(form) {
            binding
                .atomically()
                .set('formId', formId)
                .set('formName', form.name)
                .commit();
        });
    },
    onChangeFirstName: function(event) {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('firstName', event.currentTarget.value);
    },
    onChangeLastName: function(event) {
        var self = this,
            binding = self.getDefaultBinding();

        binding.set('lastName', event.currentTarget.value);
    },
    onSuccess: function() {
        var self = this,
            binding = self.getDefaultBinding(),
            currentType = binding.get('type'),
            dataToPost = {
                preset: binding.get('type'),
                schoolId: binding.get('schoolId')
            };

        if(currentType === 'parent') {
            dataToPost.comment = "Student - " + binding.get('firstName') + " " + binding.get('lastName') + "." +
                " Form - " + binding.get('formName') + ". House - " + binding.get('houseName') + "."
        }

        window.Server.Permissions
            .post(dataToPost)
            .then(function() {
                self.props.onSuccess();
            });
    },
    onAddAnother:function(){
        var self = this,
            binding = self.getDefaultBinding();
        if(self.props.fieldCount <= 4){
            self.props.fieldCount += 1;
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            currentType = binding.get('type');
        return(
            <div className="eRegistration_permissionsField">
                <If condition={currentType !== null}>
                    <AutoComplete
                        serviceFilter={self.serviceSchoolFilter}
                        serverField="name"
                        onSelect={self.onSelectSchool}
                        binding={binding.sub('_schoolAutocomplete')}
                        placeholderText="school's name"
                        />
                </If>

                <If condition={binding.get('schoolId') !== null && currentType === 'parent'}>
                    <AutoComplete
                        serviceFilter={self.serviceHouseFilter}
                        serverField="name"
                        onSelect={self.onSelectHouse}
                        binding={binding.sub('_houseAutocomplete')}
                        placeholderText="house's name"
                        />
                </If>
                <If condition={binding.get('houseId') !== null && currentType === 'parent'}>
                    <AutoComplete
                        serviceFilter={self.serviceFormFilter}
                        serverField="name"
                        onSelect={self.onSelectForm}
                        placeholderText="form's name"
                        binding={binding.sub('_formAutocomplete')}
                        />
                </If>
                <If condition={binding.get('formId') !== null && currentType === 'parent'}>
                    <div>
                        <div className="eRegistration_input">
                            <input ref="firstNameField" placeholder="Firstname" type={'text'} onChange={self.onChangeFirstName} />
                        </div>
                        <div className="eRegistration_input">
                            <input ref="lastNameField" placeholder="Lastname" type={'text'} onChange={self.onChangeLastName} />
                        </div>
                    </div>
                </If>
                <If condition={self.props.isFormFilled}>
                    <div>
                        <div className="bButton bButton_reg" onClick={self.onSuccess}>Continue</div>
                        <div className="bButton bButton_reg" onClick={self.props.onAnother}>Add</div>
                    </div>
                </If>
            </div>
        )
    }
});
module.exports = RegistrationPermissionField;