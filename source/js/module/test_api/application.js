/**
 * Created by Vitaly on 11.07.17.
 */
const   React = require('react'),
        AJAX  = require('module/core/AJAX'),
        Logging = require('module/test_api/logging');

let logId = 0;
const ApplicationView = React.createClass({
    getInitialState: function() {
        return {
            inputValue: '6vdc5kr5quiwl67uryj83zykrjnsdjpuwo9vdp6x',
            logs: []
        };
    },

    updateInputValue: function(event) {
        this.setState({
            inputValue: event.target.value
        });
    },

    addLog: function(val){
        const log = {text: val, id: logId++};
        this.state.logs.push(log);
        this.setState({logs: this.state.logs});
    },


    handleSubmit: function(event) {
        let self = this; let selectedRole;
        self.getProfile().then(function (res) {
            self.addLog("Check profile: " + res.textStatus + ". User: " + res.data.firstName + " " + res.data.lastName);
        });
        self.getRoles().then(function (res) {
            self.addLog("Check roles: " + res.textStatus);
            return Promise.all(res.data.map(function (role) {
                self.setRole(role.name).then(function (roles) {
                    self.addLog("Switch role " + roles.data.role + ": " + roles.textStatus);
                    self.getSchools(roles.data.key).then(function (schools) {
                        self.addLog("Info about schools for " + role.name + " " + schools.textStatus);
                        return Promise.all(schools.data.map(function (school) {
                            if (roles.data.role === 'ADMIN' || roles.data.role === 'MANAGER' || roles.data.role === 'TRAINER') {
                                self.getStudentList(roles.data.key, school.id).then(function (students) {
                                    self.addLog("Student list " + school.name + " for " + roles.data.role + " " + students.textStatus);
                                });
                                self.getHouseList(roles.data.key, school.id).then(function (houses) {
                                    self.addLog("House list " + school.name + " for " + roles.data.role + " " + houses.textStatus);
                                });
                                self.getFormList(roles.data.key, school.id).then(function (forms) {
                                    self.addLog("Form list " + school.name + " for " + roles.data.role + " " + forms.textStatus);
                                });
                                self.getEvents(roles.data.key, school.id).then(function (events) {
                                    self.addLog("Events " + school.name + " for " + roles.data.role + " " + events.textStatus);
                                });
                            }
                        }));
                    });
                })
            }))
        });
        event.preventDefault();
    },

    getProfile: function() {
        const   usid = this.state.inputValue,
                url = "http://api.stage1.squadintouch.com/i/profile?filter=%22%22";
        return AJAX({
            url: url,
            type: 'GET',
            headers: {"usid": usid}
        })
    },

    getRoles: function() {
        const   usid = this.state.inputValue,
                url = "http://api.stage1.squadintouch.com/i/roles?filter=%22%22";
        return AJAX({
            url: url,
            type: 'GET',
            headers: {"usid": usid}
        })
    },

    setRole: function(role) {
        const   usid = this.state.inputValue,
                url = "http://api.stage1.squadintouch.com/i/roles/" + role + "/become?filter=%22%22";
        return AJAX({
            url: url,
            type: 'POST',
            headers: {"usid": usid}
        })
    },

    getSchools: function(sessionKey) {
        const   url = "http://api.stage1.squadintouch.com/i/schools?filter=%22%22";
        return AJAX({
            url: url,
            type: 'GET',
            headers: {"usid": sessionKey}
        })
    },

    getStudentList: function(sessionKey, schoolId) {
        const   url = "http://api.stage1.squadintouch.com/i/schools/" + schoolId + "/students?filter=%7B%22limit%22%3A20%2C%22skip%22%3A20%7D&{}";
        return AJAX({
            url: url,
            type: 'GET',
            headers: {"usid": sessionKey}
        })
    },

    getHouseList: function(sessionKey, schoolId) {
        const   url = "http://api.stage1.squadintouch.com/i/schools/" + schoolId + "/houses?filter=%7B%22limit%22%3A20%7D&{}";
        return AJAX({
            url: url,
            type: 'GET',
            headers: {"usid": sessionKey}
        })
    },

    getFormList: function(sessionKey, schoolId) {
        const   url = "http://api.stage1.squadintouch.com/i/schools/" + schoolId + "/forms?filter=%7B%22limit%22%3A30%7D&{}";
        return AJAX({
            url: url,
            type: 'GET',
            headers: {"usid": sessionKey}
        })
    },

    getEvents: function(sessionKey, schoolId) {
        const   url = "http://api.stage1.squadintouch.com/i/schools/" + schoolId + "/events";
        return AJAX({
            url: url,
            type: 'GET',
            headers: {"usid": sessionKey}
        })
    },


    render: function() {
        const logs = this.state.logs;
        const logsNode = logs.map((log) => {
            return (<Logging log={log.text} key={log.id}/>)
        });
        return (
            <div>
                <form onSubmit={this.handleSubmit}>
                    <input type="text" value={this.state.inputValue} onChange={this.updateInputValue}/>
                    <input type="submit" value="Submit" />
                </form>
                {logsNode}
            </div>
        );
    }

});


module.exports = ApplicationView;