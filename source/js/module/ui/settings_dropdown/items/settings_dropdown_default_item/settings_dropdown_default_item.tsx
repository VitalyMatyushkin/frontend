import * as React from 'react';

import 'styles/ui/settings_dropdown_default_item.scss'
import {SettingsDropdownDefaultItemCheckIcon} from "module/ui/settings_dropdown/items/settings_dropdown_default_item/components/settings_dropdown_default_item_check_icon";

export interface SettingsDropdownDefaultItemProps {
	id: string
	text: string
	isSelected: boolean
	handleClick: (id: string) => void
}

export class SettingsDropdownDefaultItem extends React.Component<SettingsDropdownDefaultItemProps, {}> {
	renderCheckIcon() {
		return this.props.isSelected ? <SettingsDropdownDefaultItemCheckIcon/> : null;
	}
	render() {
		return (
			<div
				className='bSettingsDropdownDefaultItem'
				onMouseDown={() => this.props.handleClick(this.props.id)}
			>
				{this.renderCheckIcon()}
				<div className='eSettingsDropdownDefaultItem_text'>
					{this.props.text}
				</div>
			</div>
		);
	}
}