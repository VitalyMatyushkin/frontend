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
    },
    onStudentSelect:function(id, response, model){
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
            confirmation = confirm("Are you sure you want to grant access?"),
            role = document.getElementById('roleSelector');
        var schoolId = binding.get('selectedSchoolId'),
            userId = binding.get('selectedUser').userId,
            model = {};
        if(role.options[role.selectedIndex].value === 'parent'){
            model = {
                preset:role.options[role.selectedIndex].value,
                schoolId:schoolId,
                principalId:userId,
                studentId:binding.get('selectedStudentId'),
                comment:document.getElementById('studentInput').value,
                accepted:false
            }
        }else{
            model = {
                preset:role.options[role.selectedIndex].value,
                schoolId:schoolId,
                principalId:userId,
                accepted:false
            }
        }
        if(confirmation == true){
            window.Server.schoolPermissions.post({id:schoolId},model)
                .then(function(result){
                    window.Server.setPermissions.post({id:result.id},{accepted:true})
                        .then(function(acpt){
                            //console.log(acpt);
                            binding.set('popup', false);
                            alert('Successfully Granted');
                            location.reload(true);
                        });
                });
        }
    },
    revokeButtonClick:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            confirmation = confirm("Are you sure you want to grant access?"),
            role = document.getElementById('roleSelector');
        var schoolId = binding.get('selectedSchoolId'),
            userId = binding.get('selectedUser').userId,
            model = {};
        if(role.options[role.selectedIndex].value === 'parent'){
            model = {
                preset:role.options[role.selectedIndex].value,
                schoolId:schoolId,
                principalId:userId,
                studentId:binding.get('selectedStudentId'),
                comment:document.getElementById('studentInput').value,
                accepted:false
            }
        }else{
            model = {
                preset:role.options[role.selectedIndex].value,
                schoolId:schoolId,
                principalId:userId,
                accepted:false
            }
        }
        if(confirmation == true){
            //window.Server.schoolPermissions.post({id:schoolId},model)
            //    .then(function(result){
            //        binding.set('popup', false);
            //        alert('Successfully Granted');
            //    });
            alert('No API method yet!');
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding();
        return (
            <div>
                <div id="studentRow" style={{display:'none'}}>
                    <h4>Student</h4>
                    <input  id="studentInput" placeholder={"Enter last name"} onChange={self.handleChange} onBlur={self.handleBlur} onClick={self.handleClick} />
                    <div>
                        <ul id="autoComplete" className="customAutoComplete">
                            {list}
                        </ul>
                    </div>
                </div>
                <div>
                    <input type="button" onClick={function(){self.continueButtonClick()}} className="bButton bGrantButton" value="Grant"/>
                </div>
            </div>
        )
    }
});
module.exports = StudentAutoComplete;