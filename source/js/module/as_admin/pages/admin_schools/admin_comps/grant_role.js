/**
 * Created by bridark on 29/06/15.
 */
const   AutoComplete            = require('module/ui/autocomplete/autocomplete'),
        React                   = require('react'),
        ReactDOM                = require('reactDom'),
        StudentAutoComplete     = require('./StudentAutoComplete');

const GrantRole = React.createClass({
    mixins:[Morearty.Mixin],
    serviceSchoolFilter: function(schoolName) {
        return window.Server.getAllSchools.get({
            filter: {
                where: {
                    name: {
                        like: schoolName,
                        options: 'i'
                    }
                },
                limit: 10
            }
        }).then(schoolList => {
            console.log('got school list: ' + JSON.stringify(schoolList, null, 2));
            return schoolList;
        });
    },
    onSchoolSelect:function(order,id, response, model){
        this.getDefaultBinding().set('selectedSchoolId',id);
    },
    onRoleSelectorChange:function(){
        const   binding     = this.getDefaultBinding(),
                selEl       = ReactDOM.findDOMNode(this.refs.roleSelector);

        const roleName = selEl.options[selEl.selectedIndex].value;
        binding.set('isParent', roleName === 'parent');
        binding.set('roleName', roleName);
        this.forceUpdate();     // TODO: do we really need it here ?
    },
    render:function(){
        const   binding         = this.getDefaultBinding(),
                services        = { school: this.serviceSchoolFilter };
        return (
            <div className="bGrantContainer">
                <h2>New role</h2>
                <div>
                    <h4>School</h4>
                    <div>
                        <AutoComplete serviceFilter={services.school} serverField="name" binding={binding.sub('grSchool')}
                                      onSelect={this.onSchoolSelect.bind(null,0)} />
                    </div>
                    <h4>Role </h4>
                    <div>
                        <select onChange={this.onRoleSelectorChange} ref="roleSelector" id="roleSelector">
                            <option value="admin">School Admin</option>
                            <option value="manager">School Manager</option>
                            <option value="teacher">Teacher</option>
                            <option value="coach">Coach</option>
                            <option value="parent">Parent</option>
                        </select>
                    </div>
                    <h4>Student</h4>
                    <div>
                        <AutoComplete serviceFilter={services.users} serverField="lastName" binding={binding.sub('grUsers')}
                                      onSelect={function(o, id){console.log(id);}}  />
                    </div>
                    <StudentAutoComplete binding = {binding} />
                </div>
            </div>
        );
    }
});

module.exports = GrantRole;