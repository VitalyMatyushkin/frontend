/**
 * Created by wert on 16.01.16.
 */

import * as React from 'react';
import * as Auth from '../../core/services/AuthorizationServices';
import {RoleSelectorComponent as RSC} from "module/as_login/pages/RoleSelectorComponent";



export interface RoleSelectorProps {
    roleList: string[]
}

export class RoleSelector extends React.Component<RoleSelectorProps, {}> {
    onRoleSelected(roleName: string): void {
        Auth.become(roleName);
    }

    render() {
        const {roleList} = this.props;

        // not drawing roles if there is only one. It will be selected automatically
        if(roleList.length > 1) {
            return <RSC roleList={ roleList } onRoleSelected={ this.onRoleSelected }/>;
        } else {
            return null;
        }
    }
}