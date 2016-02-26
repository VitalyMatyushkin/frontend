/**
 * Created by bridark on 29/06/15.
 */
const   AutoComplete  = require('module/ui/autocomplete2/OldAutocompleteWrapper'),
        React         = require('react'),
        If            = require('module/ui/if/if'),
        Immutable     = require('immutable'),
        Lazy          = require('lazyjs');

const GrantRole = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes: {
        userIdsBinding:     React.PropTypes.object,
        onSuccess:          React.PropTypes.func
    },
    getSchools: function(filter) {
        return window.Server.getAllSchools.get({
            filter: {
                where: {
                    name: {
                        like: filter,
                        options: 'i'
                    }
                },
                limit: 10
            }
        });
    },
    onSchoolSelect:function(id, response, model){
        this.getDefaultBinding().set('selectedSchoolId',id);
    },
    getStudents: function(filter){
        const   self      = this,
                binding     = self.getDefaultBinding(),
                schoolId    = binding.get('selectedSchoolId');

        return window.Server.students.get(schoolId, {
            filter: {
                where: {
                    'userInfo.lastName': {
                        like:       filter,
                        options:    'i'
                    }
                },
                limit: 10
            }
        }).then( students => {
            return Lazy(students).map(student => {
                student.fullName = student.userInfo.firstName + ' ' + student.userInfo.lastName;
                return student;
            }).toArray();
        });
    },

    onStudentSelect:function(id, model){
        this.getDefaultBinding().set('selectedStudentId', model.id);
     },
    onRoleSelectorChange:function(e){
        const   binding     = this.getDefaultBinding(),
                roleName    = e.target.value;

        binding.set('roleName', roleName);
    },
    continueButtonClick:function(){
        const   self            = this,
                binding         = self.getDefaultBinding(),
                rootBinding     = self.getMoreartyContext().getBinding(),
                schoolId        = binding.get('selectedSchoolId'),
                model = {
                    preset:         binding.get('roleName'),
                    schoolId:       schoolId,
                    principalId:    '',
                    comment:        binding.get('comment'),
                    accepted:       false
                };

        let ids = self.props.userIdsBinding.toJS(),
            itsMe = rootBinding.get('userData.authorizationInfo.userId') === ids;

        if(!ids)
            console.error('Error! "userIdsBinding" is not set.');
        ids = ids && typeof ids === 'string' ? [ids] : ids;

        if(binding.get('roleName') === 'parent'){
            model.studentId = binding.get('selectedStudentId');
        }
        //
        ids.forEach(function(currentId){
            model.principalId = currentId;
            window.Server.Permissions.post(model)
                .then(function(result){
                    if(!itsMe)
                        return window.Server.setPermissions.post({id:result.id},{accepted:true})
                            .then(function(setPermissions){
                                self.props.onSuccess && self.props.onSuccess();
                                return setPermissions;
                            });
                    else{
                        self.props.onSuccess && self.props.onSuccess();
                    }
                    return result;
                });

        });
    },
    render:function(){
        const   self        = this,
                binding     = self.getDefaultBinding(),
                isParent    = binding.get('roleName') === 'parent' && binding.get('selectedSchoolId') !== undefined;

        return (
            <div className="bGrantContainer">
                <h2>New role</h2>
                <div>
                    <h4>School</h4>
                    <AutoComplete serviceFilter={self.getSchools} serverField="name" binding={binding.sub('grSchools')}
                                  onSelect={self.onSchoolSelect} />
                    <h4>Role </h4>
                    <div className="eManager_select_wrap">
                    <select onChange={self.onRoleSelectorChange} ref="roleSelector" id="roleSelector">
                        <option value="teacher">Teacher</option>
                        <option value="coach">Coach</option>
                        <option value="parent">Parent</option>
                        <option value="admin">School Admin</option>
                        <option value="manager">School Manager</option>
                    </select></div>
                    <If condition={isParent}>
                        <div>
                            <h4>Student</h4>
                            <AutoComplete serviceFilter={self.getStudents}
                                          serverField="fullName"
                                          binding={binding.sub('grStudents')}
                                          onSelect={self.onStudentSelect}
                            />
                        </div>
                    </If>
                    <h4>Comment:</h4>
                    <textarea onChange={function(e){binding.set('comment', e.target.value);}}/>
                    <div>
                        <input type="button" onClick={self.continueButtonClick} className="bButton bGrantButton" value="Confirm"/>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = GrantRole;