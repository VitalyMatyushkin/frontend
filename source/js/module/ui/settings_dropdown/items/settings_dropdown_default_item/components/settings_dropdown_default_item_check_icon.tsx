import * as React from 'react';

import 'styles/ui/settings_dropdown_default_item.scss'

export class SettingsDropdownDefaultItemCheckIcon extends React.Component {
	render() {
		return (
			<div className='eSettingsDropdownDefaultItem_checkIconWrapper'>
				<div className='eSettingsDropdownDefaultItem_checkIcon'>
					<i className="fa fa-check" aria-hidden="true"/>
				</div>
			</div>
		);
	}
}