/**
 * Created by bridark on 29/06/15.
 */
var StudentAutoComplete,
    Popup = require('module/ui/popup'),
    list;
StudentAutoComplete = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding();
        binding.set('isParent',false);
    },
    onStudentSelect:function(id, response, model){
    },
    getInitialState:function(){
      return {isParent:false};
    },
    handleChange:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            listItemClick = function(listItemId){
                document.getElementById('studentInput').value = document.getElementById(listItemId).innerText;
                binding.set('selectedStudentId', listItemId);
                document.getElementById('autoComplete').style.display = 'none';
            },
            query = document.getElementById('studentInput').value;
        if(query.length >=1){
            document.getElementById('autoComplete').style.display = 'block';
            window.Server.students.get({
                schoolId:binding.get('selectedSchoolId'),
                filter:{
                    where:{
                        lastName:{
                            like:query,
                            options:'i'
                        }
                    },
                    limit:10
                }
            }).then(function (studentResults) {
                binding.set('studentResults',Immutable.fromJS(studentResults));
                list = studentResults.map(function(student){
                    return(
                        <li id={student.id} onClick={function(){listItemClick(student.id)}}>{student.firstName + " "+student.lastName}</li>
                    )
                });
            });
        }
    },
    handleBlur:function(){
       //document.getElementById('studentInput').onblur = function (evt) {
       //    var el = this;
       //    setTimeout(function(){el.focus()},10);
       //}
    },
    handleClick:function(){
    },
    closeConfirmation:function(){
        var self = this,
            binding = self.getDefaultBinding();
    },
    continueButtonClick:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            confirmation = window.confirm("Are you sure you want to grant access?"),
            role = document.getElementById('roleSelector'),
            globalBinding = self.getMoreartyContext().getBinding();
        var schoolId = binding.get('selectedSchoolId'),
            userId = binding.get('selectedUser').userId,
            model = {};
        if(role.options[role.selectedIndex].value === 'parent'){
            model = {
                preset:role.options[role.selectedIndex].value,
                schoolId:schoolId,
                principalId:userId,
                studentId:binding.get('selectedStudentId'),
                comment:React.findDOMNode(self.refs.commentArea).value,
                accepted:false
            }
        }else{
            model = {
                preset:role.options[role.selectedIndex].value,
                schoolId:schoolId,
                principalId:userId,
                comment:React.findDOMNode(self.refs.commentArea).value,
                accepted:false
            }
        }
        if(confirmation == true){
            if(document.location.hash.indexOf('settings') === -1){
                window.Server.schoolPermissions.post({id:schoolId},model)
                    .then(function(result){
                        window.Server.setPermissions.post({id:result.id},{accepted:true})
                            .then(function(acpt){
                                //console.log(acpt);
                                binding.set('popup', false);
                                //location.reload(true);
                                binding.set('shouldUpdateList',true);
                            });
                    });
            }else{
                window.Server.schoolPermissions.post({id:schoolId},model)
                    .then(function(result){
                        binding.set('popup', false);
                        window.Server.userPermissions.get({userId:globalBinding.get('userData.authorizationInfo.userId')})
                            .then(function(userPermissions){
                                binding
                                    .atomically()
                                    .set('userAccountRoles',Immutable.fromJS(userPermissions))
                                    .commit();
                            });
                    });
            }
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            studentRowClass = binding.get('isParent') === true ? 'studentRowActive':'studentRowInActive';
        return (
            <div>
                <div ref="studentRow" className={studentRowClass}>
                    <h4>Student</h4>
                    <input  id="studentInput" placeholder={"Enter last name"} onChange={self.handleChange} onBlur={self.handleBlur} onClick={self.handleClick} />
                    <div>
                        <ul id="autoComplete" className="customAutoComplete">
                            {list}
                        </ul>
                    </div>
                </div>
                <div>
                    <h4>Comment:</h4>
                    <textarea ref="commentArea"></textarea>
                </div>
                <div>
                    <input type="button" onClick={function(){self.continueButtonClick()}} className="bButton bGrantButton" value="Grant"/>
                </div>
            </div>
        )
    }
});
module.exports = StudentAutoComplete;