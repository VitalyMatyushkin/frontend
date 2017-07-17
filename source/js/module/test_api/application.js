/**
 * Created by Vitaly on 11.07.17.
 */
const   React   = require('react'),
        AJAX    = require('module/core/AJAX'),
        Logging = require('module/test_api/logging');

const   domain   = "http://api.stage1.squadintouch.com";

const ApplicationView = React.createClass({
    getInitialState: function() {
        return {
            inputValue: '0cki6wswjr8ynsf5adok95iibr3jco7wr9gyabca',
            logs: [],
            logId: 0
        };
    },

    updateInputValue: (event) => {
        this.setState({
            inputValue: event.target.value
        });
    },

    addLog: function(val, type){
        let id = this.state.logId;
        id++;
        this.setState({logId: id});
        const log = {text: val, id: this.state.logId, type: type};
        let logArray = this.state.logs;
        logArray.push(log);
        this.setState({logs: logArray});
    },


    handleSubmit: function(event) {
        this.optionRequest();
        this.getProfile().then(() => {
            return this.getRoles()
        })
        .then((roles) => {
            return Promise.all(roles.data.map((role) => {
                this.setRole(role.name)
                .then((selectedRole) => {
                    this.getSchools(selectedRole.data.key, selectedRole.data.role)
                    .then((schools) => {
                        return Promise.all(schools.data.map((school) => {
                            if (selectedRole.data.role === 'ADMIN' || selectedRole.data.role === 'MANAGER' || selectedRole.data.role === 'TRAINER') {
                                Promise.all([
                                    this.getStudentList(selectedRole.data.key, school.id, school.name, selectedRole.data.role),
                                    this.getHouseList(selectedRole.data.key, school.id, school.name, selectedRole.data.role),
                                    this.getFormList(selectedRole.data.key, school.id, school.name, selectedRole.data.role),
                                    this.createEvent(selectedRole.data.key, school.id, school.name, selectedRole.data.role)
                                        .then((event) => {
                                        return this.activateEvent(selectedRole.data.key, school.id, school.name, event.data.id, selectedRole.data.role);
                                        })
                                ])
                            }
                            this.getEvents(selectedRole.data.key, school.id, school.name, selectedRole.data.role)
                        }))
                    })
                })
            }));
        })
        event.preventDefault();
    },

    getProfile: function() {
        const   usid = this.state.inputValue,
                url = `${domain}/i/profile?filter=%22%22`,
                text = `Check profile`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`);
            return res;
        })
        .catch((err) => {
            this.showError(err, "GET", url, usid, text);
        });
    },

    getRoles: function() {
        const   usid = this.state.inputValue,
                url = `${domain}/i/roles?filter=%22%22`,
                text = `Check roles`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, "message");
            return res;
        })
        .catch((err) => {
            this.showError(err, "GET", url, usid, text);
        });
    },

    setRole: function(role) {
        const   usid = this.state.inputValue,
                url = `${domain}/i/roles/${role}/become?filter=%22%22`,
                text = `Switch role ${role}`;
        return AJAX({
            url: url,
            type: 'POST',
            headers: {usid}
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, "message");
            return res;
        })
        .catch((err) => {
            this.showError(err, "POST", url, usid, text);
        });
    },

    getSchools: function(usid, role) {
        const   url = `${domain}/i/schools?filter=%22%22`,
                text = `Info about schools for role: ${role}`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, "message");
            return res;
        })
        .catch((err) => {
            this.showError(err, "GET", url, usid, text);
        });
    },

    getStudentList: function(usid, schoolId, schoolName, role) {
        const   url = `${domain}/i/schools/${schoolId}/students?filter=%7B%22limit%22%3A20%2C%22skip%22%3A20%7D&{}`,
                text = `List of students for ${role} school ${schoolName}`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, "message");
            return res;
        })
        .catch((err) => {
            this.showError(err, "GET", url, usid, text);
        });
    },

    getHouseList: function(usid, schoolId, schoolName, role) {
        const   url = `${domain}/i/schools/${schoolId}/houses?filter=%7B%22limit%22%3A20%7D&{}`,
                text = `List of houses for ${role} school ${schoolName}`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, "message");
            return res;
        })
        .catch((err) => {
            this.showError(err, "GET", url, usid, text);
        });
    },

    getFormList: function(usid, schoolId, schoolName, role) {
        const   url = `${domain}/i/schools/${schoolId}/forms?filter=%7B%22limit%22%3A30%7D&{}`,
                text = `List of classes for ${role} school ${schoolName}`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, "message");
            return res;
        })
        .catch((err) => {
            this.showError(err, "GET", url, usid, text);
        });
    },

    getEvents: function(usid, schoolId, schoolName, role) {
        const   url = `${domain}/i/schools/${schoolId}/events`,
                text = `Events for ${role} school ${schoolName}`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, "message");
            return res;
        })
        .catch((err) => {
            this.showError(err, "GET", url, usid, text);
        });
    },

    createEvent: function(usid, schoolId, schoolName, role) {
        const   data = {"gender":"MALE_ONLY","eventType":"EXTERNAL_SCHOOLS","ages":[1],"sportId":"57b6caa5dd69264b6c5bb06b","startTime":"2017-07-13T04:00:52.697Z","venue":{"venueType":"HOME","postcodeId":"57b6cd0b1c0b151bcf94afdc"},"invitedSchoolIds":["58b554f5533a3b03e36d49e6"]},
                url = `${domain}/i/schools/${schoolId}/events?filter=%22%22`,
                text = `Create event for ${schoolName} by ${role}`;
        return AJAX({
            url: url,
            type: 'POST',
            headers: {usid},
            data: JSON.stringify(data),
            contentType: 'application/json'
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, "message");
            return res;
        })
        .catch((err) => {
            this.showError(err, "POST", url, usid, text);
        });
    },

    activateEvent: function(usid, schoolId, schoolName, eventId, role) {
        const   url = `${domain}/i/schools/${schoolId}/events/${eventId}/activate?filter=%22%22`,
                text = `Activate event for ${schoolName} by ${role}`;
        return AJAX({
            url: url,
            type: 'POST',
            headers: {usid},
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, "message");
            return res;
        })
        .catch((err) => {
            this.showError(err, "POST", url, usid, text);
        });
    },

    optionRequest: function() {
        const   url = `${domain}/i/profile?filter=%22%22`,
                text = `OPTIONS REQUEST`;
        return AJAX({
            url: url,
            type: 'OPTIONS'
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, "message");
            return res;
        })
        .catch((err) => {
            this.addLog(`${text} status: ${err.xhr.status}`, "err");
        });
    },

    showError: function(err, type, url, usid, text) {
        this.addLog(
            `${text}: ${err.textStatus}
            status: ${err.xhr.status}
            type: ${type}
            url: ${url}
            usid: ${usid}
            responseText: ${err.xhr.responseText}`
        , "err");
    },

    render: function() {
        const logs = this.state.logs;
        const logsNode = logs.map((log) => {
            return (<Logging log={log.text} key={log.id} type={log.type}/>)
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