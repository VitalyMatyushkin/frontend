/**
 * Created by bridark on 29/06/15.
 */
var GrantRole,
    AutoComplete = require('module/ui/autocomplete/autocomplete'),
    StudentAutoComplete = require('./StudentAutoComplete');
GrantRole = React.createClass({
    mixins:[Morearty.Mixin],
    componentWillMount:function(){
        var self = this,
            binding = self.getDefaultBinding(); console.log(binding);
    },
    serviceSchoolFilter: function(schoolName) {
        var self = this,
            binding = self.getDefaultBinding();
        return window.Server.schools.get({
            filter: {
                where: {
                    name: {
                        like: schoolName,
                        options: 'i'
                    }
                },
                include:{
                    relation:'students'
                },
                limit: 10
            }
        });
    },
    onSchoolSelect:function(order,id, response,model){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding();
        binding.set('selectedSchoolId',id);
    },
    onRoleSelectorChange:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            selEl = document.getElementById('roleSelector'); console.log('selected');
        if(selEl.options[selEl.selectedIndex].value === 'parent'){
            document.getElementById('studentRow').style.display = 'block';
        }else{
            document.getElementById('studentRow').style.display = 'none';
        }
    },
    render:function(){
        var self = this,
            binding = self.getDefaultBinding(),
            rootBinding = self.getMoreartyContext().getBinding(),
            services = {'school':self.serviceSchoolFilter};
        return (<div className="bGrantContainer">
                    <h2>New role for <span style={{color:'red'}}>{binding.get('selectedUser').userName}</span></h2>
                    <div>
                        <h4>School</h4>
                        <div>
                            <AutoComplete serviceFilter={services['school']} serverField="name" onSelect={self.onSchoolSelect.bind(null,0)} binding={binding} />
                        </div>
                        <h4>Role </h4>
                        <div>
                            <select onChange={function(){self.onRoleSelectorChange()}} id="roleSelector">
                                <option value="admin">School Admin</option>
                                <option value="manager">School Manager</option>
                                <option value="teacher">Teacher</option>
                                <option value="coach">Coach</option>
                                <option value="parent">Parent</option>
                            </select>
                        </div>
                        <StudentAutoComplete binding = {binding}/>
                    </div>
                </div>);
    }
});
module.exports = GrantRole;