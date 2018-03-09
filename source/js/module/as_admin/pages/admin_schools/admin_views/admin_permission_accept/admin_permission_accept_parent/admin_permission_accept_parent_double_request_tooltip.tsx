import * as React from 'react'

import 'styles/ui/b_admin_permission_accept_parent_double_request_tooltip.scss'

export interface AdminPermissionAcceptParentDoubleRequestTooltipProps {
	childName: string
}

export class AdminPermissionAcceptParentDoubleRequestTooltip extends React.Component<AdminPermissionAcceptParentDoubleRequestTooltipProps, {}> {
	render() {
		return (
			<div className='bAdminPermissionAcceptParentDoubleRequestTooltip'>
				<p>
					It appears this parent user is already linked to: {this.props.childName}, but you can link them to another student account if needed. Alternatively, if this is a duplicate request for the same student please simply decline it, this will not affect their parental access to the student they are already linked to.
				</p>
			</div>
		);
	}
}