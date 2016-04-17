/**
 * Created by bridark on 15/10/15.
 */
const   AutoComplete            = require('module/ui/autocomplete2/OldAutocompleteWrapper'),
        If                      = require('module/ui/if/if'),
        ExtraPermissionsField   = require('module/ui/register/user/extra_permission_fields'),
        React                   = require('react');
/*
 *
 *
 */
const RegistrationPermissionField = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes:{
        isFormFilled:   React.PropTypes.bool,
        onSuccess:      React.PropTypes.func.isRequired,
        fieldCounter:   React.PropTypes.number.isRequired,
        onAnother:      React.PropTypes.func.isRequired,
        showButtons:    React.PropTypes.bool.isRequired
    },
    /**
     * school filter by schoolName
     * @param schoolName
     * @returns {*}
     */
    serviceSchoolFilter: function(schoolName) {

        return window.Server.publicSchools.get( {
            filter: {
                where: {
                    name: {
                        like: schoolName,
                        options: 'i'
                    }
                }
            }
        });
    },
    /**
     * house filter by houseName
     * @param houseName
     * @returns {*}
     */
    serviceHouseFilter: function(houseName) {
        const   self    = this,
                binding = self.getDefaultBinding();

        return window.Server.publicSchoolHouses.get(binding.get('schoolId'), {
            filter: {
                where: {
                    name: {
                        like: houseName,
                        options: 'i'
                    }
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
        const   self    = this,
                binding = self.getDefaultBinding();

        return window.Server.publicSchoolForms.get(binding.get('schoolId'), {
            filter: {
                where: {
                    name: {
                        like: formName,
                        options: 'i'
                    }
                }
            }
        });
    },
    onSelectSchool: function(schoolId) {
        const   self        = this,
                binding     = self.getDefaultBinding();
        binding
            .atomically()
            .set('schoolId', schoolId)
            .commit();
    },
    onSelectHouse: function(houseId) {
        const   self    = this,
                binding = self.getDefaultBinding();

        window.Server.publicSchoolHouse.get({houseId: houseId, schoolId: binding.get('schoolId')}).then( house => {
            binding
                .atomically()
                .set('houseId', houseId)
                .set('houseName', house.name)
                .commit();
        });

    },
    onSelectForm: function(formId) {
        const   self    = this,
                binding = self.getDefaultBinding();

        window.Server.publicSchoolForm.get({formId: formId, schoolId: binding.get('schoolId')}).then(form => {
            binding
                .atomically()
                .set('formId', formId)
                .set('formName', form.name)
                .commit();
        });
    },
    onChangeFirstName: function(event) {
        const   self = this,
                binding = self.getDefaultBinding();

        binding.set('firstName', event.currentTarget.value);
    },
    onChangeLastName: function(event) {
        const   self = this,
                binding = self.getDefaultBinding();

        binding.set('lastName', event.currentTarget.value);
    },
    onSuccess: function() {
        const   self        = this,
                binding     = self.getDefaultBinding(),
                currentType = binding.get('type'),
                dataToPost  = {
                    preset:     binding.get('type'),
                    schoolId:   binding.get('schoolId')
                };
        if(currentType === 'parent') {
            dataToPost.comment = "Student - " + binding.get('firstName') + " " + binding.get('lastName') + "." +
                " Form - " + binding.get('formName') + ". House - " + binding.get('houseName') + ".";
            if(binding.get('studentExtra_1')){
                dataToPost.comment +="Student - "+binding.get('studentExtra_1').firstName+" "+binding.get('studentExtra_1').lastName+"."+
                    " Form - "+binding.get('studentExtra_1').form+". House - "+binding.get('studentExtra_1').house+".";
            }
            if(binding.get('studentExtra_2')){
                dataToPost.comment +="Student - "+binding.get('studentExtra_2').firstName+" "+binding.get('studentExtra_2').lastName+"."+
                    " Form - "+binding.get('studentExtra_2').form+". House - "+binding.get('studentExtra_2').house+".";
            }
        }
        window.Server.permissionRequests.post(dataToPost).then( _ => self.props.onSuccess());
    },
    schoolMessage: function () {
        return (
            <div className="eForm_message">
                Haven’t found your school? <a href="mailto:support@squadintouch.com?subject=Please add school">Email us</a> and we will add it!
            </div>)
    },

    render:function(){
        const   self        = this,
                binding     = self.getDefaultBinding(),
                currentType = binding.get('type'),
                message     = self.schoolMessage();
        return(
            <div>
                <div className="eRegistration_permissionsField">
                    <If condition={currentType !== null}>
                        <div>
                        <AutoComplete
                            serviceFilter={self.serviceSchoolFilter}
                            serverField="name"
                            onSelect={self.onSelectSchool}
                            binding={binding.sub('_schoolAutocomplete')}
                            placeholderText="school's name"
                            />
                            {message}
                        </div>
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
                    <If condition={self.props.showButtons == true}>
                        <div>
                            <If condition={self.props.isFormFilled && currentType ==='parent'}>
                                <div>
                                    <div className="bButton bButton_reg" onClick={self.onSuccess}>Continue</div>
                                    <div className="bButton bButton_reg" onClick={self.props.onAnother}>Add</div>
                                </div>
                            </If>
                            <If condition={self.props.isFormFilled && currentType !== 'parent'}>
                                <div className="bButton bButton_reg" onClick={self.onSuccess}>Continue</div>
                            </If>
                        </div>
                    </If>
                </div>
                <If condition={self.props.fieldCounter > 1 && currentType ==='parent'}>
                    <div className="eRegistration_permissionsField">
                        <ExtraPermissionsField binding={binding} extraFieldKey="studentExtra_1"></ExtraPermissionsField>
                    </div>
                </If>
                <If condition={self.props.fieldCounter > 2 && currentType ==='parent'}>
                    <div className="eRegistration_permissionsField">
                        <ExtraPermissionsField binding={binding} extraFieldKey="studentExtra_2"></ExtraPermissionsField>
                    </div>
                </If>
            </div>
        )
    }
});
module.exports = RegistrationPermissionField;