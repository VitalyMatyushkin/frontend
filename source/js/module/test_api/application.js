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
            inputValue: 'eox9noqguyigu2f5tuu1c51qwxei0maf9wg8bbo2',
            logs: []
        };
    },

    updateInputValue: (event) => {
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
        const self = this;
        self.getProfile().then(() => {
            return self.getRoles()
        })
        .then((roles) => {
            return Promise.all(roles.data.map((role) => {
                self.setRole(role.name)
                .then((selectedRole) => {
                    self.getSchools(selectedRole.data.key, selectedRole.data.role)
                    .then((schools) => {
                        return Promise.all(schools.data.map((school) => {
                            if (selectedRole.data.role === 'ADMIN' || selectedRole.data.role === 'MANAGER' || selectedRole.data.role === 'TRAINER') {
                                Promise.all([
                                    self.getStudentList(selectedRole.data.key, school.id, school.name),
                                    self.getHouseList(selectedRole.data.key, school.id, school.name),
                                    self.getFormList(selectedRole.data.key, school.id, school.name)
                                ]);
                            }
                            self.getEvents(selectedRole.data.key, school.id, school.name)
                        }))
                    })
                })
            }));
        })
        .catch((err) => {
            self.addLog(err);
        });
        event.preventDefault();
    },

    getProfile: function() {
        const   usid = this.state.inputValue, self = this,
                url = "http://api.stage1.squadintouch.com/i/profile?filter=%22%22";
        return AJAX({
            url: url,
            type: 'GET',
            headers: {"usid": usid}
        }).then((res) => {
            self.addLog("Check profile: " + res.textStatus + ". User: " + res.data.firstName + " " + res.data.lastName);
            return res;
        })
    },

    getRoles: function() {
        const   usid = this.state.inputValue, self = this,
                url = "http://api.stage1.squadintouch.com/i/roles?filter=%22%22";
        return AJAX({
            url: url,
            type: 'GET',
            headers: {"usid": usid}
        }).then((res) => {
            self.addLog("Check roles: " + res.textStatus);
            return res;
        })
    },

    setRole: function(role) {
        const   usid = this.state.inputValue, self = this,
                url = "http://api.stage1.squadintouch.com/i/roles/" + role + "/become?filter=%22%22";
        return AJAX({
            url: url,
            type: 'POST',
            headers: {"usid": usid}
        }).then((res) => {
            self.addLog("Switch role " + res.data.role + ": " + res.textStatus);
            return res;
        })
    },

    getSchools: function(sessionKey, role) {
        const   url = "http://api.stage1.squadintouch.com/i/schools?filter=%22%22",
                self = this;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {"usid": sessionKey}
        }).then((res) => {
            self.addLog("Info about schools for role: " + role + ": " + res.textStatus);
            return res;
        })
    },

    getStudentList: function(sessionKey, schoolId, schoolName) {
        const   url = "http://api.stage1.squadintouch.com/i/schools/" + schoolId + "/students?filter=%7B%22limit%22%3A20%2C%22skip%22%3A20%7D&{}",
                self = this;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {"usid": sessionKey}
        }).then((res) => {
            self.addLog("Student list for school " + schoolName + ": " + res.textStatus);
            return res;
        })
    },

    getHouseList: function(sessionKey, schoolId, schoolName) {
        const   url = "http://api.stage1.squadintouch.com/i/schools/" + schoolId + "/houses?filter=%7B%22limit%22%3A20%7D&{}",
                self = this;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {"usid": sessionKey}
        }).then((res) => {
            self.addLog("House list for school " + schoolName + ": " + res.textStatus);
            return res;
        })
    },

    getFormList: function(sessionKey, schoolId, schoolName) {
        const   url = "http://api.stage1.squadintouch.com/i/schools/" + schoolId + "/forms?filter=%7B%22limit%22%3A30%7D&{}",
                self = this;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {"usid": sessionKey}
        }).then((res) => {
            self.addLog("Form list for school " + schoolName + ": " + res.textStatus);
            return res;
        })
    },

    getEvents: function(sessionKey, schoolId, schoolName) {
        const   url = "http://api.stage1.squadintouch.com/i/schools/" + schoolId + "/events",
                self = this;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {"usid": sessionKey}
        }).then((res) => {
            self.addLog("Events for school " + schoolName + ": " + res.textStatus);
            return res;
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