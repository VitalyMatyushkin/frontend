/**
 * Created by bridark on 29/06/15.
 */
var StudentAutoComplete,
    list;
StudentAutoComplete = React.createClass({
    mixins:[Morearty.Mixin],
    serviceStudent:function(studentName){
        var self = this,
            binding = self.getDefaultBinding();
        window.Server.students.get({
            schoolId:binding.get('selectedSchoolId'),
            filter:{
                where:{
                    lastName:{
                        like:studentName,
                        options:'i'
                    }
                },
                limit:10
            }
        }).then(function (studentResults) {
            binding.set('studentResults',Immutable.fromJS(studentResults));
        });
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
                    <input type="button" className="bButton bGrantButton" value="Continue"/>
                </div>
            </div>
        )
    }
});
module.exports = StudentAutoComplete;