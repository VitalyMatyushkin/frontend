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
        console.log(model);
    },
    handleChange:function(){
        console.log('changed');
        var self = this,
            binding = self.getDefaultBinding(),
            listItemClick = function(listItemId){
                console.log(document.getElementById(listItemId).innerText);
                document.getElementById('studentInput').value = document.getElementById(listItemId).innerText;
                console.log(listItemId);
            },
            query = document.getElementById('studentInput').value;
        if(query.length >=1){
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
       document.getElementById('studentInput').onblur = function (evt) {
           var el = this;
           setTimeout(function(){el.focus()},10);
       }
    },
    handleClick:function(){
        //console.log('clicked')
    },
    closeConfirmation:function(){
        var self = this,
            binding = self.getDefaultBinding();
    },
    continueButtonClick:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            confirmation = confirm("Are you sure you want to grant access?");
        if(confirmation == true){
            binding.set('popup', false);
            alert('API not implemented!');
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
                        <ul className="customAutoComplete">
                            {list}
                        </ul>
                    </div>
                </div>
                <div>
                    <input type="button" onClick={function(){self.continueButtonClick()}} className="bButton bGrantButton" value="Continue"/>
                </div>
            </div>
        )
    }
});
module.exports = StudentAutoComplete;