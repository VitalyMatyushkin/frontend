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
            inputValue: 'w94ij4f8gqp154swhsi5k22rzb4ttmpd1mflmnes',
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
                                    this.getStudentList(selectedRole.data.key, school.id, school.name),
                                    this.getHouseList(selectedRole.data.key, school.id, school.name),
                                    this.getFormList(selectedRole.data.key, school.id, school.name),
                                    this.createEvent(selectedRole.data.key, school.id, school.name)
                                        .then((event) => {
                                        return this.activateEvent(selectedRole.data.key, school.id, school.name, event.data.id);
                                        })
                                ])
                            }
                            this.getEvents(selectedRole.data.key, school.id, school.name)
                        }))
                    })
                })
            }));
        })
        .catch((e) => {
            this.addLog("Error", "err");
        });
        event.preventDefault();
    },

    getProfile: function() {
        const   usid = this.state.inputValue,
                url = `${domain}/i/profile?filter=%22%22`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`Check profile: ${res.textStatus}. User: ${res.data.firstName} ${res.data.lastName}`);
            return res;
        })
    },

    getRoles: function() {
        const   usid = this.state.inputValue,
                url = `${domain}/i/roles?filter=%22%22`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`Check roles: ${res.textStatus}`, "message");
            return res;
        })
    },

    setRole: function(role) {
        const   usid = this.state.inputValue,
                url = `${domain}/i/roles/${role}/become?filter=%22%22`;
        return AJAX({
            url: url,
            type: 'POST',
            headers: {usid}
        }).then((res) => {
            this.addLog(`Switch role ${res.data.role}: ${res.textStatus}`, "message");
            return res;
        })
    },

    getSchools: function(usid, role) {
        const   url = `${domain}/i/schools?filter=%22%22`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`Info about schools for role: ${role}: ${res.textStatus}`, "message");
            return res;
        })
    },

    getStudentList: function(usid, schoolId, schoolName) {
        const   url = `${domain}/i/schools/${schoolId}/students?filter=%7B%22limit%22%3A20%2C%22skip%22%3A20%7D&{}`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`Student list for school ${schoolName}: ${res.textStatus}`, "message");
            return res;
        })
    },

    getHouseList: function(usid, schoolId, schoolName) {
        const   url = `${domain}/i/schools/${schoolId}/houses?filter=%7B%22limit%22%3A20%7D&{}`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`House list for school ${schoolName}: ${res.textStatus}`, "message");
            return res;
        })
    },

    getFormList: function(usid, schoolId, schoolName) {
        const   url = `${domain}/i/schools/${schoolId}/forms?filter=%7B%22limit%22%3A30%7D&{}`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`Form list for school ${schoolName}: ${res.textStatus}`, "message");
            return res;
        })
    },

    getEvents: function(usid, schoolId, schoolName) {
        const   url = `${domain}/i/schools/${schoolId}/events`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`Events for school ${schoolName}: ${res.textStatus}`, "message");
            return res;
        })
    },

    createEvent: function(usid, schoolId, schoolName) {
        let data = {"gender":"MALE_ONLY","eventType":"EXTERNAL_SCHOOLS","ages":[1],"sportId":"57b6caa5dd69264b6c5bb06b","startTime":"2017-07-13T04:00:52.697Z","venue":{"venueType":"HOME","postcodeId":"57b6cd0b1c0b151bcf94afdc"},"invitedSchoolIds":["58b554f5533a3b03e36d49e6"]};
        const url = `${domain}/i/schools/${schoolId}/events?filter=%22%22`;
        return AJAX({
            url: url,
            type: 'POST',
            headers: {usid},
            data: JSON.stringify(data),
            contentType: 'application/json'
        }).then((res) => {
            this.addLog(`Event was created for ${schoolName}: ${res.textStatus}`, "message");
            return res;
        })
    },

    activateEvent: function(usid, schoolId, schoolName, eventId) {
        const url = `${domain}/i/schools/${schoolId}/events/${eventId}/activate?filter=%22%22`;
        return AJAX({
            url: url,
            type: 'POST',
            headers: {usid},
        }).then((res) => {
            this.addLog(`Event was activated for ${schoolName}: ${res.textStatus}`, "message");
            return res;
        })
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