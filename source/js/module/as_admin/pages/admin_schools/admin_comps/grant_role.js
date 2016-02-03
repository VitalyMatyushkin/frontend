/**
 * Created by bridark on 29/06/15.
 */
const   AutoComplete  = require('module/ui/autocomplete/autocomplete'),
        React         = require('react'),
        ReactDOM      = require('reactDom'),
        If            = require('module/ui/if/if'),
        Immutable     = require('immutable');

const GrantRole = React.createClass({
    mixins:[Morearty.Mixin],
    propTypes: {
        userIds: React.PropTypes.object,
        onSuccess: React.PropTypes.func
    },
    getDefaultState:function(){
        return Immutable.Map({
            roleName:'teacher'
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
        return window.Server.users.get({
            filter:{
                where:{
                    lastName:{
                        like:filter,
                        options:'i'
                    }
                },
                limit:10
            }
        }).then(function (students) {
            const list = students.map(s => {s.fullName = s.firstName + ' ' + s.lastName; return s;});
            return list;
        });
    },
    onStudentSelect:function(id, response, model){
        this.getDefaultBinding().set('selectedStudentId',id);
    },
    onRoleSelectorChange:function(e){
        const   binding     = this.getDefaultBinding(),
                selEl       = ReactDOM.findDOMNode(this.refs.roleSelector);

        const roleName = selEl.options[selEl.selectedIndex].value;
        binding.set('roleName', roleName);
    },
    continueButtonClick:function(){
        const self = this,
            binding = self.getDefaultBinding(),
            confirmation = window.confirm("Are you sure you want to grant access?"),
            schoolId = binding.toJS('selectedSchoolId'),
            model = {
                preset:binding.get('roleName') ,
                schoolId:schoolId,
                principalId:'',
                comment:ReactDOM.findDOMNode(self.refs.commentArea).value,
                accepted:false
            };

        let ids = self.props.userIds.toJS();
        if(!ids)
            console.error('Error! "userIds" is not set.');
        ids = ids && !ids.length ? [ids] : ids;

        if(binding.get('roleName') === 'parent'){
            model.studentId = binding.toJS('selectedStudentId');
        }
        if(confirmation){
            ids.forEach(function(currentId){
                model.principalId = currentId;
                window.Server.Permissions.post(model)
                    .then(function(result){
                        return window.Server.setPermissions.post({id:result.id},{accepted:true});
                    })
                    .then(function(setPermissions){
                        self.props.onSuccess && self.props.onSuccess();
                        return;
                    });
            });
        }
    },
    render:function(){
        const   self = this,
                binding = self.getDefaultBinding(),
                isParent = binding.get('roleName') === 'parent';

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
                    <textarea ref="commentArea"></textarea>
                    <div>
                        <input type="button" onClick={self.continueButtonClick} className="bButton bGrantButton" value="Grant"/>
                    </div>
                </div>
            </div>
        );
    }
});

module.exports = GrantRole;