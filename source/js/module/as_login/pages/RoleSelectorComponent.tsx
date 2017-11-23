/**
 * Created by wert on 13.09.16.
 */

import * as React from 'react';
import * as Button from 'module/ui/button/button';
import * as RoleHelper from 'module/helpers/role_helper';


export interface RoleSelectorComponentProps {
    roleList:       string[],
    onRoleSelected: (string) => any
}

/**
 * It just renders list of buttons with role names. When any button clicked, handler called with role name.
 * 
 */
export const RoleSelectorComponent: React.SFC<RoleSelectorComponentProps> = (props) => {
	const { onRoleSelected, roleList } = props;

	return (
		<div className="bRoleSelector">
			{roleList.map(roleName =>
				<Button	key		= {roleName}
						text	= {RoleHelper.ROLE_TO_PERMISSION_MAPPING[roleName]}
						onClick	= {() => onRoleSelected(roleName)}
				/>
			)}
		</div>
	);
};