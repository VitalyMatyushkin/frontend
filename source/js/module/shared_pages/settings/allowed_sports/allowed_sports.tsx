import * as React from 'react'

import 'styles/ui/b_allowed_sports.scss'
import {Permission} from "../../../models/permission/permission";

export interface AllowedSportsProps {
	permission: Permission
}

export class AllowedSports extends React.Component<AllowedSportsProps, {}> {
	renderSchoolSportListByPermission(permission) {
		let sports;
		if(permission.sports.length > 0) {
			sports = permission.sports.map(sport => <div>{sport.name}</div>)
		} else {
			sports = 'Allowed all sports in current school';
		}

		return (
			<div>
				{sports}
			</div>
		);
	}
	renderSchoolSportsByPermission(permission) {
		return (
			<div className='eAllowedSports_schoolSports'>
				<h2 className='eAllowedSports_schoolSportsHeader'>
					{permission.school.name}
				</h2>
				{this.renderSchoolSportListByPermission(permission)}
			</div>
		);
	}
	render() {
		return (
			<div className="bAllowedSports">
				<h3 className="eAllowedSports_header">Allowed Sports</h3>
				<div className="eAllowedSports_body">
					{this.renderSchoolSportsByPermission(this.props.permission)}
				</div>
			</div>
		);
	}
};