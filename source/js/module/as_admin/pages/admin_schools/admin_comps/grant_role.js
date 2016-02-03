/**
 * Created by bridark on 29/06/15.
 */
const   AutoComplete  = require('module/ui/autocomplete/autocomplete'),
        React         = require('react'),
        If            = require('module/ui/if/if'),
        Immutable     = require('immutable'),
        Lazy          = require('lazyjs');

const GrantRole = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes: {
        userIdsBinding: React.PropTypes.object,
        onSuccess: React.PropTypes.func
    },
    getDefaultState:function(){
        return Immutable.Map({
            roleName:'teacher',
            comment:''
        });
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
        }).then(schoolList => {
            //console.log('got school list: ' + JSON.stringify(schoolList, null, 2));
            return schoolList;
        });
    },
    onSchoolSelect:function(id, response, model){
        this.getDefaultBinding().set('selectedSchoolId',id);
    },
    getStudents:function(filter){
        const self = this,
            binding = self.getDefaultBinding(),
            schoolId = binding.get('selectedSchoolId');

        return window.Server.users.get({
            filter:{
                include:["permissions"],
                where:{
                    lastName:{
                        like:filter,
                        options:'i'
                    }
                },
                limit:50
            }
        }).then(function (students) {
            if(schoolId){
                students = Lazy(students).filter(s => {
                    return s.permissions && s.permissions.length > 0 && !Lazy(s.permissions).filter(p => {
                            return p.preset === 'student' && p.schoolId === schoolId
                        }).isEmpty();
                }).first(10).toArray();
            }

            const list = students.map(s => {s.fullName = s.firstName + ' ' + s.lastName; return s;});
            return list;
        });
    },
    onStudentSelect:function(id, response, model){
        const self = this,
            binding = self.getDefaultBinding(),
            studentId = Lazy(model.permissions).find(p=> p.preset === 'student').studentId;

        binding.set('selectedStudentId',studentId);
     },
    onRoleSelectorChange:function(e){
        const   binding     = this.getDefaultBinding(),
                roleName    = e.target.value;

        binding.set('roleName', roleName);
    },
    continueButtonClick:function(){
        const self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            confirmation = window.confirm("Are you sure you want to grant access?"),
            schoolId = binding.get('selectedSchoolId'),
            model = {
                preset:binding.get('roleName'),
                schoolId:schoolId,
                principalId:'',
                comment:binding.get('comment'),
                accepted:false
            };

        let ids = self.props.userIdsBinding.toJS(),
            itsMe = rootBinding.get('userData.authorizationInfo.userId') === ids;

        if(!ids)
            console.error('Error! "userIdsBinding" is not set.');
        ids = ids && typeof ids === 'string' ? [ids] : ids;

        if(binding.get('roleName') === 'parent'){
            model.studentId = binding.get('selectedStudentId');
        }
        if(confirmation){
            ids.forEach(function(currentId){
                model.principalId = currentId;
                window.Server.Permissions.post(model)
                    .then(function(result){
                        if(!itsMe)
                            return window.Server.setPermissions.post({id:result.id},{accepted:true})
                                .then(function(setPermissions){
                                    self.props.onSuccess && self.props.onSuccess();
                                    return;
                                });
                        else{
                            self.props.onSuccess && self.props.onSuccess();
                            return;
                        }
                    });

            });
        }
    },
    render:function(){
        const   self = this,
                binding = self.getDefaultBinding(),
                isParent = binding.get('roleName') === 'parent' && binding.get('selectedSchoolId') !== undefined;

        return (
            <div className="bGrantContainer">
                <h2>New role</h2>
                <div>
                    <h4>School</h4>
                    <AutoComplete serviceFilter={self.getSchools} serverField="name" binding={binding.sub('grSchools')}
                                  onSelect={self.onSchoolSelect} />
                    <h4>Role </h4>
                    <select onChange={self.onRoleSelectorChange} ref="roleSelector" id="roleSelector">
                        <option value="teacher">Teacher</option>
                        <option value="coach">Coach</option>
                        <option value="parent">Parent</option>
                        <option value="admin">School Admin</option>
                        <option value="manager">School Manager</option>
                    </select>
                    <If condition={isParent}>
                        <div>
                            <h4>Student</h4>
                            <AutoComplete serviceFilter={self.getStudents} serverField="fullName" binding={binding.sub('grStudents')}
                                          onSelect={self.onStudentSelect}  />
                        </div>
                    </If>
                    <h4>Comment:</h4>
                    <textarea onChange={function(e){binding.set('comment', e.target.value);}}></textarea>
                    <div>
                        <input type="button" onClick={self.continueButtonClick} className="bButton bGrantButton" value="Grant"/>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = GrantRole;