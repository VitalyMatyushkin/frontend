/**
 * Created by Vitaly on 11.07.17.
 */

import * as React from 'react';
import {AxiosAjax} from 'module/core/ajax/axios-ajax';
import * as LoggingList from 'module/as_api_test/logging-list';
import {SVG} from 'module/ui/svg';
import * as loaderUtils from 'module/helpers/loader_utils';
import * as CropImageHelper from 'module/helpers/crop_image_helper';


const   domain      = document.location.hostname,
        apiMain		= loaderUtils.apiSelector(domain).main,
        apiImg  	= loaderUtils.apiSelector(domain).img,
        imgTestSrc  = '/images/panda.jpeg';

const   NOT_STARTED = "NOT_STARTED",
        PROCESSED   = "PROCESSED",
        COMPLETED   = "COMPLETED",
        MESSAGE     = "MESSAGE",
        ERROR       = "ERROR";

const Ajax = new AxiosAjax();

function printStatus(status: number) {
	if(status >= 200 && status < 299) {
		return 'ok';
	} else {
		return 'fail';
	}
}

interface ApplicationViewState {
	inputValue: string
	logs: any[]
	logId: number
	status: "NOT_STARTED" | "PROCESSED" | "COMPLETED" | "MESSAGE" | "ERROR"
}

export class ApplicationView extends React.Component<{}, ApplicationViewState> {
	constructor(props) {
		super(props);

		this.state = {
			inputValue: "",
			logs: [],
			logId: 0,
			status: NOT_STARTED
		};
	}

    updateInputValue(event) {
        this.setState({
            inputValue: event.target.value
        });
    }

    addLog(val, type) {
        let id = this.state.logId;
        id++;
        this.setState({logId: id});
        const log = {text: val, id: this.state.logId, type: type};
        let logArray = this.state.logs;
        logArray.push(log);
        this.setState({logs: logArray});
    }


    handleSubmit(e) {
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
            return Promise.all((roles as any).data.map((role) => {
                return this.setRole(role.name)
                .then((selectedRole) => {
                    return Promise.all(role.permissions.map((school) =>{
                        return this.getSchoolInfo((selectedRole as any).data.key, school.schoolId, school.school.name, (selectedRole as any).data.role)
                        .then(() => {
                            return this.getEvents((selectedRole as any).data.key, school.schoolId, school.school.name, (selectedRole as any).data.role);
                        })
                        .then(() => {
                            if (school.school.kind === 'School' && ((selectedRole as any).data.role === 'ADMIN' || (selectedRole as any).data.role === 'MANAGER' || (selectedRole as any).data.role === 'TRAINER')) {
                                return Promise.all([
                                    this.getStudentList((selectedRole as any).data.key, school.schoolId, school.school.name, (selectedRole as any).data.role),
                                    this.getHouseList((selectedRole as any).data.key, school.schoolId, school.school.name, (selectedRole as any).data.role),
                                    this.getFormList((selectedRole as any).data.key, school.schoolId, school.school.name, (selectedRole as any).data.role),
                                    this.createEvent((selectedRole as any).data.key, school.schoolId, school.school.name, (selectedRole as any).data.role)
                                    .then((event) => {
                                        return this.activateEvent((selectedRole as any).data.key, school.schoolId, school.school.name, (event as any).data.id, (selectedRole as any).data.role);
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
    }

    getProfile() {
        const   usid = this.state.inputValue,
                url = `${apiMain}/i/profile`,
                text = `Check profile`;

        return Ajax.request({ url, method: 'get', headers: { usid }})
			.then( res => {
				this.addLog(`${text}: ${printStatus(res.status)}`, MESSAGE);
				return res;
			})
			.catch( err => {
				this.showError(err, "get", url, usid, text);
			});
    }

    getRoles() {
        const   usid = this.state.inputValue,
                url = `${apiMain}/i/roles`,
                text = `Check roles`;
        return Ajax.request({url, method: 'get', headers: {usid}})
			.then(res => {
				this.addLog(`${text}: ${printStatus(res.status)}`, MESSAGE);
				return res;
			})
			.catch((err) => {
				this.showError(err, "get", url, usid, text);
			});
    }

    setRole(role) {
        const   usid	= this.state.inputValue,
                url		= `${apiMain}/i/roles/${role}/become`,
                text	= `Switch role ${role}`;
        return Ajax.request({url, method: 'post', headers: {usid}})
			.then( res => {
				this.addLog(`${text}: ${printStatus(res.status)}`, MESSAGE);
				return res;
			})
			.catch((err) => {
				this.showError(err, "POST", url, usid, text);
			});
    }

    getSchoolInfo(usid, schoolId, schoolName, role) {
        const   url = `${apiMain}/i/schools/${schoolId}`,
            	text = `Info about school ${schoolName} for role: ${role}`;
        return Ajax.request({url, method: 'get', headers: {usid}})
			.then(res => {
				this.addLog(`${text}: ${printStatus(res.status)}`, MESSAGE);
				return res;
			})
            .catch((err) => {
                this.showError(err, "get", url, usid, text);
            });
    }

    getStudentList(usid, schoolId, schoolName, role) {
        const   url = `${apiMain}/i/schools/${schoolId}/students`,
                text = `List of students for ${role} school ${schoolName}`;
        return Ajax.request({url, method: 'get', headers: {usid}})
			.then(res => {
				this.addLog(`${text}: ${printStatus(res.status)}`, MESSAGE);
				return res;
			})
			.catch((err) => {
				this.showError(err, "get", url, usid, text);
			});
    }

    getHouseList(usid, schoolId, schoolName, role) {
        const   url = `${apiMain}/i/schools/${schoolId}/houses`,
                text = `List of houses for ${role} school ${schoolName}`;
        return Ajax.request({url, method: 'get', headers: {usid}})
			.then(res => {
				this.addLog(`${text}: ${printStatus(res.status)}`, MESSAGE);
				return res;
			})
			.catch((err) => {
				this.showError(err, "get", url, usid, text);
			});
    }

    getFormList(usid, schoolId, schoolName, role) {
        const   url = `${apiMain}/i/schools/${schoolId}/forms`,
                text = `List of classes for ${role} school ${schoolName}`;
        return Ajax.request({url, method: 'get', headers: {usid}})
			.then(res => {
				this.addLog(`${text}: ${printStatus(res.status)}`, MESSAGE);
				return res;
			})
			.catch((err) => {
				this.showError(err, "get", url, usid, text);
			});
    }

    getEvents(usid, schoolId, schoolName, role) {
        const   url = `${apiMain}/i/schools/${schoolId}/events?filter=%7B%22limit%22%3A200%2C%22where%22%3A%7B%22startTime%22%3A%7B%22%24gte%22%3A%222017-07-16T18%3A00%3A00.000Z%22%2C%22%24lt%22%3A%222017-07-17T18%3A00%3A00.000Z%22%7D%2C%22%24or%22%3A%5B%7B%22eventType%22%3A%7B%22%24in%22%3A%5B%22INTERNAL_HOUSES%22%2C%22INTERNAL_TEAMS%22%5D%7D%7D%2C%7B%22eventType%22%3A%7B%22%24in%22%3A%5B%22EXTERNAL_SCHOOLS%22%5D%7D%2C%22inviterSchoolId%22%3A%2257d154fdf07ed2150ef39bde%22%7D%2C%7B%22eventType%22%3A%7B%22%24in%22%3A%5B%22EXTERNAL_SCHOOLS%22%5D%7D%2C%22inviterSchoolId%22%3A%7B%22%24ne%22%3A%2257d154fdf07ed2150ef39bde%22%7D%2C%22invitedSchoolIds%22%3A%2257d154fdf07ed2150ef39bde%22%2C%22status%22%3A%7B%22%24in%22%3A%5B%22ACCEPTED%22%2C%22REJECTED%22%2C%22status%22%2C%22CANCELED%22%5D%7D%7D%5D%7D%7D&{}`,
                text = `Events for ${role} school ${schoolName}`;
        return Ajax.request({url, method: 'get', headers: {usid}})
			.then(res => {
				this.addLog(`${text}: ${printStatus(res.status)}`, MESSAGE);
				return res;
			})
			.catch((err) => {
				this.showError(err, "get", url, usid, text);
			});
    }

    getFirstSports(usid, schoolId, schoolName, role) {
        const   url		= `${apiMain}/i/schools/${schoolId}/sports`,
                text	= `Sports for ${role} school ${schoolName}`;
        return Ajax.request({url, method: 'get', headers: {usid}})
			.then(res => {
				return res.data[0].id;
			})
			.catch((err) => {
				this.showError(err, "get", url, usid, text);
			});
    }

    createEvent(usid, schoolId, schoolName, role) {
		const	text	= `Create event for ${schoolName} by ${role}`,
				url		= `${apiMain}/i/schools/${schoolId}/events`;

        return this.getFirstSports(usid, schoolId, schoolName, role)
            .then((sportId) => {
                const   data = {"gender":"MALE_ONLY","eventType":"INTERNAL_TEAMS","ages":[1],"sportId":sportId,
                        "startTime":"2017-07-13T04:00:52.697Z","venue":{"venueType":"TBD"},
                        "invitedSchoolIds":[schoolId]};
                return Ajax.request({url, method: 'post', headers: {usid}, data: data})
			})
			.then((res) => {
				this.addLog(`${text}: ${printStatus(res.status)}`, MESSAGE);
				return res;
			})
			.catch((err) => {
				this.showError(err, "post", url, usid, text);
			});
    }

    activateEvent(usid, schoolId, schoolName, eventId, role) {
        const   url		= `${apiMain}/i/schools/${schoolId}/events/${eventId}/activate`,
                text	= `Activate event for ${schoolName} by ${role}`;

        return Ajax.request({url, method: 'post', headers: {usid}})
			.then((res) => {
				this.addLog(`${text}: ${printStatus(res.status)}`, MESSAGE);
				return res;
			})
			.catch((err) => {
				this.showError(err, "post", url, usid, text);
			});
    }

    checkCORSRequest() {
        const   url = `${apiMain}/i/profile`,
                usid = this.state.inputValue,
                text = `CORS`;

        return Ajax.request({url, method: 'get', headers: {usid}})
			.then((res) => {
				this.addLog(`${text} ${'get'}: ${printStatus(res.status)}`, MESSAGE);
				return res;
			})
			.catch((err) => {
				if (typeof err.xhr === "undefined") {
					this.addLog(`${text} not supported`, ERROR);
				} else {
					this.showError(err, 'get', url, usid, text);
				}
			});
    }

    showError(err, type, url, usid, text) {
        this.addLog(
            `${text}: ${printStatus(err.status)}
            status: ${err.status}
            type: ${type}
            url: ${url}
            usid: ${usid}`
        , ERROR);
    }

    showLogsBlock(logs, errorCount) {
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
    }

    uploadImgToServer() {
        const   canvas 	    = this.refs.canvasImage,
                imageObject = this.refs.imageSrc,
                url         = `${apiImg}/images`,
                fd          = new FormData(),
                text        = "Images server is";

		(canvas as any)
            .getContext("2d")
            .drawImage(imageObject, 0, 0);

        const file = CropImageHelper.dataURLtoFile((canvas as any).toDataURL("image/jpeg"));
        fd.append('image', file);
        return Ajax.request({url, method: 'post', data: fd})
        .then((res) => {
            this.addLog(`${text} working. Status: ${printStatus(res.status)}. URL testing image: http:${apiImg}/images/${res.data['key']}`, MESSAGE);
            return `${apiImg}/images/${res.data['key']}`;
        })
        .catch((err) => {
            this.addLog(`${text} not working. Status: ${err.xhr.status}`, ERROR);
        });
    }
    
    render() {
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
                <form className="bForm" onSubmit={e => this.handleSubmit(e)}>
                    <input
                        type        = "text"
                        id          = "session-key-text"
                        value       = { this.state.inputValue }
                        placeholder = "Please enter session key"
                        onChange    = { e => this.updateInputValue(e) }
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
}