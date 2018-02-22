/**
 * Created by vitaly on 04.01.18.
 */

import * as React from 'react';
import * as Morearty from 'morearty';
import * as	Immutable from 'immutable';
import {SVG} from 'module/ui/svg';

import 'styles/pages/b_action_descriptor.scss';
import {ServiceList} from "module/core/service_list/service_list";

interface ExtraDataAffectedUser {
	type: string
	list: string
}

interface AffectedUser {
	userId:				string
	permissionId:		string
	extra?:				ExtraDataAffectedUser
	firstName?:			string
	gender?:			string
	id?:				string
	lastName?:			string
	_id?:				string
}

interface UsersToNotify {
	userId:				string
	permissionId:		string
	firstName?:			string
	lastName?:			string
	_id?:				string
}

interface TriggeredBy {
	userId:				string
	permissionIdList:	string[]
	schoolId:			string
	isSuperadmin:		boolean
	firstName:			string
	lastName:			string
}

interface Player {
	isCaptain: 				boolean
	isTeamPlayer: 			boolean
	participationStatus: 	string
	permissionId: 			string
	schoolId: 				string
	teamId: 				string
	userId: 				string
	_id: 					string
}

export interface ActionDescriptor {
	affectedUserList: AffectedUser[]
	affectedUserListStatus: string
	canEmitNotifications: boolean
	createdAt: string
	id: string
	manualConfirmationStatus: string
	notificationEmissionStatus: string
	notificationMode: string
	performerType: string
	triggeredBy: TriggeredBy
	updatedAt: string
	usersToNotifyList: UsersToNotify[]
	eventId?: string
	schoolId?: string
	teamId?: string
	playersAdded?: Player[]
	playersBefore?: Player[]
	playersRemoved?: Player[]
	playersUpdated?: Player[]
}

export const ActionDescriptorItem = (React as any).createClass({
	mixins: [Morearty.Mixin],
	componentWillMount() {
		const 	binding 			= this.getDefaultBinding(),
				globalBinding 		= this.getMoreartyContext().getBinding(),
				actionDescriptorId 	= globalBinding.get('routing.pathParameters.0');
		
		binding.set('isSync', false);
		
		(window.Server as ServiceList).actionDescriptor.get({adId: actionDescriptorId})
			.then((actionDescriptor: ActionDescriptor[]) => {
				binding.set('isSync', true);
				binding.set('actionDescriptor', Immutable.fromJS(actionDescriptor));
			});
	},
	
	renderAffectedUserList(): React.ReactNode {
		const 	binding = this.getDefaultBinding(),
				actionDescriptor = binding.toJS('actionDescriptor'),
				titles = ['userId', 'firstName', 'lastName', 'permissionId', 'extra'];
		
		const rows = actionDescriptor.affectedUserList.map((rowObj, i) => {
			const cells = titles.map( title => {
				if (title === 'extra') {
					const 	extraType = typeof rowObj[title]['type'] !== 'undefined' ? `Type: ${rowObj[title]['type']}` : '',
							extraList = typeof rowObj[title]['list'] !== 'undefined' ? `List: ${rowObj[title]['list']}` : '';
					return (<td key={title+i}>{extraType} {extraList}</td>);
				} else {
					return <td key={title+i}>{rowObj[title]}</td>;
				}
			});
			
			return (
				<tr key={i}>
					<th scope="row">{i + 1}</th>
					{cells}
				</tr>
			);
		});
		return (
			<div className="eActionDescriptor_table table-responsive">
				<h3>Affected User List</h3>
				<table className="table table-striped">
					<thead>
					<tr>
						<th >#</th>
						<th>User Id</th>
						<th>Permission Id</th>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Extra</th>
					</tr>
					</thead>
					<tbody>{rows}</tbody>
				</table>
			</div>
		);
	},
	
	renderUsersToNotifyList(): React.ReactNode {
		const 	binding = this.getDefaultBinding(),
				actionDescriptor = binding.toJS('actionDescriptor'),
				titles = ['userId', 'firstName', 'lastName', 'permissionId'];
		
		const rows = actionDescriptor.usersToNotifyList.map((rowObj, i) => {
			const cells = titles.map( title => {
				return <td key={title+i}>{rowObj[title]}</td>;
			});
			
			return (
				<tr key={i}>
					<th scope="row">{i + 1}</th>
					{cells}
				</tr>
			);
		});
		return (
			<div className="eActionDescriptor_table table-responsive">
				<h3>Users To Notify List</h3>
				<table className="table table-striped">
					<thead>
					<tr>
						<th >#</th>
						<th>User Id</th>
						<th>First Name</th>
						<th>Last Name</th>
						<th>Permission Id</th>
					</tr>
					</thead>
					<tbody>{rows}</tbody>
				</table>
			</div>
		);
	},
	
	renderActionDescriptorData(): React.ReactNode {
		const 	binding = this.getDefaultBinding(),
				actionDescriptor = binding.toJS('actionDescriptor');
		
		let name = '';
		
		if (typeof actionDescriptor.triggeredBy !== 'undefined'){
			const 	firstName = typeof actionDescriptor.triggeredBy.firstName !== 'undefined' ? actionDescriptor.triggeredBy.firstName : '',
					lastName = typeof actionDescriptor.triggeredBy.lastName !== 'undefined' ? actionDescriptor.triggeredBy.lastName : '';
			name = `${firstName} ${lastName}`;
		}
				
		return (
			<div className = "bActionDescriptor_container">
				<div className = "eActionDescriptor_main">
					<div className = "eText">
						<div className = "eTextKey">Name</div>
						<div className = "eTextValue">{name}</div>
						<div className = "eTextKey">Affected User List Status</div>
						<div className = "eTextValue">{actionDescriptor.affectedUserListStatus}</div>
						<div className = "eTextKey">Manual Confirmation Status</div>
						<div className = "eTextValue">{actionDescriptor.manualConfirmationStatus}</div>
						<div className = "eTextKey">Notification Emission Status</div>
						<div className = "eTextValue">{actionDescriptor.notificationEmissionStatus}</div>
					</div>
				</div>
				{this.renderAffectedUserList()}
				{this.renderUsersToNotifyList()}
			</div>
		);
	},
	
	render() {
		const 	binding = this.getDefaultBinding(),
				isSync = binding.get('isSync');
		
		if (isSync) {
			return 	this.renderActionDescriptorData();
		} else {
			return <div className="eLoader eActionDescriptor_loader"><SVG icon="icon_spin-loader-black" /></div>;
		}
	}
});
