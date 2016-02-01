/**
 * Created by bridark on 29/06/15.
 */
const   React       = require('react'),
        ReactDOM    = require('reactDom'),
        Immutable   = require('immutable');

let list;

const StudentAutoComplete = React.createClass({
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
                ReactDOM.findDOMNode(self.refs.studentInput).value = ReactDOM.findDOMNode(self.refs[listItemId]).innerText;
                binding.set('selectedStudentId', listItemId);
                ReactDOM.findDOMNode(self.refs.autoComplete).style.display = 'none';
            },
            query = ReactDOM.findDOMNode(self.refs.studentInput).value;
        if(query.length >=1){
            ReactDOM.findDOMNode(self.refs.autoComplete).style.display = 'block';
            //window.Server.students.get({
            //    schoolId:binding.get('selectedSchoolId'),
                window.Server.users.get({
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
                        <li ref={student.id} onClick={function(){listItemClick(student.id)}}>{student.firstName + " "+student.lastName}</li>
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
    continueButtonClick:function(){
        const self = this,
            binding = self.getDefaultBinding(),
            confirmation = window.confirm("Are you sure you want to grant access?"),
            globalBinding = self.getMoreartyContext().getBinding(),
            schoolId = binding.get('selectedSchoolId'),
            userId = binding.get('groupIds')=== undefined ? binding.get('selectedUser').userId :'',
            model = {
                preset:binding.get('roleName') ,
                schoolId:schoolId,
                principalId:userId,
                comment:ReactDOM.findDOMNode(self.refs.commentArea).value,
                accepted:false
            };

        if(binding.get('roleName') === 'parent'){
            model.studentId = binding.get('selectedStudentId');
        }
        if(confirmation == true){
            if(document.location.hash.indexOf('settings') === -1){
                if(binding.get('groupIds') !== undefined){
                    binding.get('groupIds').forEach(function(currentId){
                        model.principalId = currentId;
                        window.Server.schoolPermissions.post({id:schoolId},model)
                            .then(function(result){
                                window.Server.setPermissions.post({id:result.id},{accepted:true})
                                    .then(function(acpt){
                                        binding.set('popup', false);
                                        window.location.reload(true);
                                    });
                            });
                    });
                }else{
                    window.Server.schoolPermissions.post({id:schoolId},model)
                        .then(function(result){
                            window.Server.setPermissions.post({id:result.id},{accepted:true})
                                .then(function(acpt){
                                    binding.set('popup', false);
                                });
                        });
                }
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
    //render:function(){
    //    var self = this,
    //        binding = self.getDefaultBinding(),
    //        studentRowClass = binding.get('isParent') === true ? 'studentRowActive':'studentRowInActive';
    //    return (
    //        <div>
    //            <div ref="studentRow" className={studentRowClass}>
    //                <h4>Student</h4>
    //                <input ref="studentInput" placeholder={"Enter last name"} onChange={self.handleChange} onBlur={self.handleBlur} onClick={self.handleClick} />
    //                <div>
    //                    <ul ref="autoComplete" className="customAutoComplete">
    //                        {list}
    //                    </ul>
    //                </div>
    //            </div>
    //            <div>
    //                <h4>Comment:</h4>
    //                <textarea ref="commentArea"></textarea>
    //            </div>
    //            <div>
    //                <input type="button" onClick={function(){self.continueButtonClick()}} className="bButton bGrantButton" value="Grant"/>
    //            </div>
    //        </div>
    //    )
    //}
});
module.exports = StudentAutoComplete;