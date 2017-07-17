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
            inputValue: '',
            logs: [],
            logId: 0
        };
    },

    updateInputValue: function(event) {
        this.setState({
            inputValue: event.target.value
        });
    },

    addLog: function(val, type) {
        let id = this.state.logId;
        id++;
        this.setState({logId: id});
        const log = {text: val, id: this.state.logId, type: type};
        let logArray = this.state.logs;
        logArray.push(log);
        this.setState({logs: logArray});
    },


    handleSubmit: function() {
        this.checkCORSRequest()
        .then(() => {
            return this.getProfile();
        })
        .then(() => {
            return this.getRoles()
        })
        .then((roles) => {
            return Promise.all(roles.data.map((role) => {
                this.setRole(role.name)
                    .then((selectedRole) => {
                        return Promise.all(role.permissions.map((school) =>{
                            this.getSchoolInfo(selectedRole.data.key, school.schoolId, school.school.name, selectedRole.data.role);
                            this.getEvents(selectedRole.data.key, school.schoolId, school.school.name, selectedRole.data.role)
                            if (school.school.kind === 'School' && (selectedRole.data.role === 'ADMIN' || selectedRole.data.role === 'MANAGER' || selectedRole.data.role === 'TRAINER')) {
                                Promise.all([
                                    this.getStudentList(selectedRole.data.key, school.schoolId, school.school.name, selectedRole.data.role),
                                    this.getHouseList(selectedRole.data.key, school.schoolId, school.school.name, selectedRole.data.role),
                                    this.getFormList(selectedRole.data.key, school.schoolId, school.school.name, selectedRole.data.role),
                                    this.createEvent(selectedRole.data.key, school.schoolId, school.school.name, selectedRole.data.role)
                                        .then((event) => {
                                            return this.activateEvent(selectedRole.data.key, school.schoolId, school.school.name, event.data.id, selectedRole.data.role);
                                        })
                                ]);
                            }
                        }));
                    })
            }));
        });
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

    getSchoolInfo: function(usid, schoolId, schoolName, role) {
        const   url = `${domain}/i/schools/${schoolId}?filter=%22%22`,
            text = `Info about school ${schoolName} for role: ${role}`;
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
        const   url = `${domain}/i/schools/${schoolId}/events?filter=%7B%22limit%22%3A200%2C%22where%22%3A%7B%22startTime%22%3A%7B%22%24gte%22%3A%222017-07-16T18%3A00%3A00.000Z%22%2C%22%24lt%22%3A%222017-07-17T18%3A00%3A00.000Z%22%7D%2C%22%24or%22%3A%5B%7B%22eventType%22%3A%7B%22%24in%22%3A%5B%22INTERNAL_HOUSES%22%2C%22INTERNAL_TEAMS%22%5D%7D%7D%2C%7B%22eventType%22%3A%7B%22%24in%22%3A%5B%22EXTERNAL_SCHOOLS%22%5D%7D%2C%22inviterSchoolId%22%3A%2257d154fdf07ed2150ef39bde%22%7D%2C%7B%22eventType%22%3A%7B%22%24in%22%3A%5B%22EXTERNAL_SCHOOLS%22%5D%7D%2C%22inviterSchoolId%22%3A%7B%22%24ne%22%3A%2257d154fdf07ed2150ef39bde%22%7D%2C%22invitedSchoolIds%22%3A%2257d154fdf07ed2150ef39bde%22%2C%22status%22%3A%7B%22%24in%22%3A%5B%22ACCEPTED%22%2C%22REJECTED%22%2C%22FINISHED%22%2C%22CANCELED%22%5D%7D%7D%5D%7D%7D&{}`,
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

    checkCORSRequest: function() {
        const   url = `${domain}/i/profile?filter=%22%22`,
                usid = this.state.inputValue,
                text = `CORS`,
                typeRequest = "GET";
        return AJAX({
            url: url,
            type: typeRequest,
            headers: {usid},
        }).then((res) => {
            this.addLog(`${text} ${typeRequest}: ${res.textStatus}`, "message");
            return res;
        })
        .catch((err) => {
            if (typeof err.xhr === "undefined") {
                this.addLog(`${text} not supported`, "err");
            } else {
                this.showError(err, typeRequest, url, usid, text);
            }
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
            <div >
                <form className="bForm" onSubmit={this.handleSubmit}>
                    <input type="text" id="session-key-text" value={this.state.inputValue} onChange={this.updateInputValue}/>
                    <input type="submit" className="bButton" id="session-key-submit" value="Submit" />
                </form>
                <div className="bSchoolMaster">
                    {logsNode}
                </div>
            </div>
        );
    }

});


module.exports = ApplicationView;