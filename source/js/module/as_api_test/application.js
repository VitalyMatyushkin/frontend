/**
 * Created by Vitaly on 11.07.17.
 */
const   React       = require('react'),
        AJAX        = require('module/core/AJAX'),
        LoggingList = require('module/as_api_test/logging-list'),
        SVG 	    = require('module/ui/svg'),
        loaderUtils = require('module/helpers/loader_utils'),
         CropImageHelper = require('module/helpers/crop_image_helper');

const   domain      = document.location.hostname,
        apiMain		= loaderUtils.apiSelector(domain).main,
        apiImg  	= loaderUtils.apiSelector(domain).img,
        imgTestSrc  = '/images/panda.jpeg';

const   NOT_STARTED = "NOT_STARTED",
        PROCESSED   = "PROCESSED",
        COMPLETED   = "COMPLETED",
        MESSAGE     = "MESSAGE",
        ERROR       = "ERROR";

const ApplicationView = React.createClass({
    getInitialState: function() {
        return {
            inputValue: "",
            logs: [],
            logId: 0,
            status: NOT_STARTED
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


    handleSubmit: function(e) {
        e.preventDefault();
        this.setState({
            logs: [],
            logId: 0,
            status: PROCESSED
        });
        this.uploadImgToServer();
        this.checkCORSRequest()
        .then(() => {
            return this.getProfile();
        })
        .then(() => {
            return this.getRoles()
        })
        .then((roles) => {
            return Promise.all(roles.data.map((role) => {
                return this.setRole(role.name)
                .then((selectedRole) => {
                    return Promise.all(role.permissions.map((school) =>{
                        return this.getSchoolInfo(selectedRole.data.key, school.schoolId, school.school.name, selectedRole.data.role)
                        .then(() => {
                            return this.getEvents(selectedRole.data.key, school.schoolId, school.school.name, selectedRole.data.role);
                        })
                        .then(() => {
                            if (school.school.kind === 'School' && (selectedRole.data.role === 'ADMIN' || selectedRole.data.role === 'MANAGER' || selectedRole.data.role === 'TRAINER')) {
                                return Promise.all([
                                    this.getStudentList(selectedRole.data.key, school.schoolId, school.school.name, selectedRole.data.role),
                                    this.getHouseList(selectedRole.data.key, school.schoolId, school.school.name, selectedRole.data.role),
                                    this.getFormList(selectedRole.data.key, school.schoolId, school.school.name, selectedRole.data.role),
                                    this.createEvent(selectedRole.data.key, school.schoolId, school.school.name, selectedRole.data.role)
                                    .then((event) => {
                                        return this.activateEvent(selectedRole.data.key, school.schoolId, school.school.name, event.data.id, selectedRole.data.role);
                                    })
                                ])
                            }
                        });
                    }))
                })
            }))
        })
        .then(() => {
            this.setState({status: COMPLETED});
        })
        .catch(() => {
            this.setState({status: COMPLETED});
        });
    },

    getProfile: function() {
        const   usid = this.state.inputValue,
                url = `${apiMain}/i/profile?filter=%22%22`,
                text = `Check profile`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, MESSAGE);
            return res;
        })
        .catch((err) => {
            this.showError(err, "GET", url, usid, text);
        });
    },

    getRoles: function() {
        const   usid = this.state.inputValue,
                url = `${apiMain}/i/roles?filter=%22%22`,
                text = `Check roles`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, MESSAGE);
            return res;
        })
        .catch((err) => {
            this.showError(err, "GET", url, usid, text);
        });
    },

    setRole: function(role) {
        const   usid = this.state.inputValue,
                url = `${apiMain}/i/roles/${role}/become?filter=%22%22`,
                text = `Switch role ${role}`;
        return AJAX({
            url: url,
            type: 'POST',
            headers: {usid}
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, MESSAGE);
            return res;
        })
        .catch((err) => {
            this.showError(err, "POST", url, usid, text);
        });
    },

    getSchoolInfo: function(usid, schoolId, schoolName, role) {
        const   url = `${apiMain}/i/schools/${schoolId}?filter=%22%22`,
            text = `Info about school ${schoolName} for role: ${role}`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, MESSAGE);
            return res;
        })
            .catch((err) => {
                this.showError(err, "GET", url, usid, text);
            });
    },

    getStudentList: function(usid, schoolId, schoolName, role) {
        const   url = `${apiMain}/i/schools/${schoolId}/students?filter=%7B%22limit%22%3A20%2C%22skip%22%3A20%7D&{}`,
                text = `List of students for ${role} school ${schoolName}`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, MESSAGE);
            return res;
        })
        .catch((err) => {
            this.showError(err, "GET", url, usid, text);
        });
    },

    getHouseList: function(usid, schoolId, schoolName, role) {
        const   url = `${apiMain}/i/schools/${schoolId}/houses?filter=%7B%22limit%22%3A20%7D&{}`,
                text = `List of houses for ${role} school ${schoolName}`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, MESSAGE);
            return res;
        })
        .catch((err) => {
            this.showError(err, "GET", url, usid, text);
        });
    },

    getFormList: function(usid, schoolId, schoolName, role) {
        const   url = `${apiMain}/i/schools/${schoolId}/forms?filter=%7B%22limit%22%3A30%7D&{}`,
                text = `List of classes for ${role} school ${schoolName}`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, MESSAGE);
            return res;
        })
        .catch((err) => {
            this.showError(err, "GET", url, usid, text);
        });
    },

    getEvents: function(usid, schoolId, schoolName, role) {
        const   url = `${apiMain}/i/schools/${schoolId}/events?filter=%7B%22limit%22%3A200%2C%22where%22%3A%7B%22startTime%22%3A%7B%22%24gte%22%3A%222017-07-16T18%3A00%3A00.000Z%22%2C%22%24lt%22%3A%222017-07-17T18%3A00%3A00.000Z%22%7D%2C%22%24or%22%3A%5B%7B%22eventType%22%3A%7B%22%24in%22%3A%5B%22INTERNAL_HOUSES%22%2C%22INTERNAL_TEAMS%22%5D%7D%7D%2C%7B%22eventType%22%3A%7B%22%24in%22%3A%5B%22EXTERNAL_SCHOOLS%22%5D%7D%2C%22inviterSchoolId%22%3A%2257d154fdf07ed2150ef39bde%22%7D%2C%7B%22eventType%22%3A%7B%22%24in%22%3A%5B%22EXTERNAL_SCHOOLS%22%5D%7D%2C%22inviterSchoolId%22%3A%7B%22%24ne%22%3A%2257d154fdf07ed2150ef39bde%22%7D%2C%22invitedSchoolIds%22%3A%2257d154fdf07ed2150ef39bde%22%2C%22status%22%3A%7B%22%24in%22%3A%5B%22ACCEPTED%22%2C%22REJECTED%22%2C%22status%22%2C%22CANCELED%22%5D%7D%7D%5D%7D%7D&{}`,
                text = `Events for ${role} school ${schoolName}`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, MESSAGE);
            return res;
        })
        .catch((err) => {
            this.showError(err, "GET", url, usid, text);
        });
    },

    getFirstSports: function(usid, schoolId, schoolName, role) {
        const   url = `${apiMain}/i/schools/${schoolId}/sports`,
                text = `Sports for ${role} school ${schoolName}`;
        return AJAX({
            url: url,
            type: 'GET',
            headers: {usid}
        }).then((res) => {
            return res.data[0].id;
        })
        .catch((err) => {
            this.showError(err, "GET", url, usid, text);
        });
    },

    createEvent: function(usid, schoolId, schoolName, role) {
        return this.getFirstSports(usid, schoolId, schoolName, role)
            .then((sportId) => {
                const   data = {"gender":"MALE_ONLY","eventType":"INTERNAL_TEAMS","ages":[1],"sportId":sportId,
                        "startTime":"2017-07-13T04:00:52.697Z","venue":{"venueType":"TBD"},
                        "invitedSchoolIds":[schoolId]},
                        url = `${apiMain}/i/schools/${schoolId}/events?filter=%22%22`,
                        text = `Create event for ${schoolName} by ${role}`;
                return AJAX({
                    url: url,
                    type: 'POST',
                    headers: {usid},
                    data: JSON.stringify(data),
                    contentType: 'application/json'
                }).then((res) => {
                    this.addLog(`${text}: ${res.textStatus}`, MESSAGE);

                    return res;
                })
                .catch((err) => {
                    this.showError(err, "POST", url, usid, text);
                });
            })
    },

    activateEvent: function(usid, schoolId, schoolName, eventId, role) {
        const   url = `${apiMain}/i/schools/${schoolId}/events/${eventId}/activate?filter=%22%22`,
                text = `Activate event for ${schoolName} by ${role}`;
        return AJAX({
            url: url,
            type: 'POST',
            headers: {usid},
        })
        .then((res) => {
            this.addLog(`${text}: ${res.textStatus}`, MESSAGE);
            return res;
        })
        .catch((err) => {
            this.showError(err, "POST", url, usid, text);
        });
    },

    checkCORSRequest: function() {
        const   url = `${apiMain}/i/profile?filter=%22%22`,
                usid = this.state.inputValue,
                text = `CORS`,
                typeRequest = "GET";
        return AJAX({
            url: url,
            type: typeRequest,
            headers: {usid},
        })
        .then((res) => {
            this.addLog(`${text} ${typeRequest}: ${res.textStatus}`, MESSAGE);
            return res;
        })
        .catch((err) => {
            if (typeof err.xhr === "undefined") {
                this.addLog(`${text} not supported`, ERROR);
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
        , ERROR);
    },

    showLogsBlock: function(logs, errorCount) {
        if (this.state.status === COMPLETED) {
            return(
                <div>
                    <div className="bMessageBlock">
                        {errorCount > 0 ? "There were some errors" : "Everything seems to be okay"}
                    </div>
                    <LoggingList logs={logs} />
                </div>
            );
        } else {
            if (this.state.status === PROCESSED){
                return(<div className="eLoader"><SVG icon="icon_spin-loader-black" /></div>);
            }
        }
    },

    uploadImgToServer: function () {
        const   canvas 	    = this.refs.canvasImage,
                imageObject = this.refs.imageSrc,
                url         = `${apiImg}/images`,
                fd          = new FormData(),
                text        = "Images server is";
        canvas
            .getContext("2d")
            .drawImage(imageObject, 0, 0);
        const file = CropImageHelper.dataURLtoFile(canvas.toDataURL("image/jpeg"), 'image-squadintouch.jpeg');
        fd.append('image', file);
        return AJAX({
            url: url,
            type: 'POST',
            data: fd,
            processData:    false,
            contentType:    false
        })
        .then((res) => {
            this.addLog(`${text} working. Status: ${res.textStatus}. URL testing image: http:${apiImg}/images/${res.data.key}`, MESSAGE);
            return `${apiImg}/images/${res.data.key}`;
        })
        .catch((err) => {
            this.addLog(`${text} not working. Status: ${err.xhr.status}`, ERROR);
        });
    },
    
    render: function() {
        let logs = [], errorCount = 0;
        if (this.state.status === COMPLETED) {
            logs = this.state.logs;
            logs.forEach((item) => {
                if (item.type === ERROR) {
                    errorCount++;
                }
            })
        }
        return (
            <div className="testApi">
                <form className="bForm" onSubmit={this.handleSubmit}>
                    <input
                        type        = "text"
                        id          = "session-key-text"
                        value       = { this.state.inputValue }
                        placeholder = "Please enter session key"
                        onChange    = { this.updateInputValue }
                    />
                    <input
                        type        = "submit"
                        className   = "bButton"
                        id          = "session-key-submit"
                        value       = "Submit"
                    />
                </form>
                {this.showLogsBlock(logs, errorCount)}
                <canvas
                    ref 		= "canvasImage"
                    className 	= "mDisplayNone"
                >
                    <img
                        src 		= { imgTestSrc }
                        ref 		= "imageSrc"
                    />
                </canvas>
            </div>
        );
    }
});

module.exports = ApplicationView;