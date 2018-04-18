import * as React from 'react';

import 'styles/ui/settings_dropdown_title_item.scss'

export interface SettingsDropdownDefaultItemProps {
	text: string
}

export class SettingsDropdownTitleItem extends React.Component<SettingsDropdownDefaultItemProps, {}> {
	render() {
		return (
			<div className='bSettingsDropdownTitleItem'>
				{this.props.text}
			</div>
		);
	}
}