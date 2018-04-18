import * as React from 'react';

import {SettingsDropdownDefaultItem} from "module/ui/settings_dropdown/items/settings_dropdown_default_item/settings_dropdown_default_item";

import 'styles/ui/settings_dropdown.scss'
import {SettingsDropdownSeparateLineItem} from "module/ui/settings_dropdown/items/settings_dropdown_separate_line_item";
import {SettingsDropdownTitleItem} from "module/ui/settings_dropdown/items/settings_dropdown_title_item";

export interface SettingsDropdownItemModel {
	id: string,
	text: string,
	isSelected: boolean,
	type: SettingsDropdownItemType
}

export enum SettingsDropdownItemType {
	SettingsDropdownTitleItem = 'SETTINGS_DROPDOWN_TITLE_ITEM',
	SettingsDropdownDefaultItem = 'SETTINGS_DROPDOWN_DEFAULT_ITEM',
	SettingsDropdownSeparateLineItem = 'SETTINGS_DROPDOWN_SEPARATE_LINE_ITEM'
}

export interface SettingsDropdownProps {
	handleClickItem: (id: string) => void
	items: any[]
}

interface SettingsDropdownState {
	isOpen: boolean
}

export class SettingsDropdown extends React.Component<SettingsDropdownProps, SettingsDropdownState> {
	componentWillMount() {
		this.setState({isOpen: false});
	}
	handleClickItem(id: string) {
		this.props.handleClickItem(id);
		this.setState({isOpen: false});
	}
	handleClick() {
		if(this.state.isOpen) {
			this.setState({isOpen: false});
		} else {
			this.setState({isOpen: true});
		}
	}
	handleBlur() {
		this.setState({isOpen: false});
	}
	renderItem(item: SettingsDropdownItemModel) {
		switch (item.type) {
			case SettingsDropdownItemType.SettingsDropdownDefaultItem: {
				return (
					<SettingsDropdownDefaultItem
						id={item.id}
						text={item.text}
						isSelected={item.isSelected}
						handleClick={(id) => this.handleClickItem(id)}
					/>
				);
			}
			case SettingsDropdownItemType.SettingsDropdownTitleItem: {
				return (
					<SettingsDropdownTitleItem text={item.text}/>
				);
			}
			case SettingsDropdownItemType.SettingsDropdownSeparateLineItem: {
				return (
					<SettingsDropdownSeparateLineItem/>
				);
			}
		}
	}
	renderDropdown() {
		if(this.state.isOpen) {
			return (
				<div className='eSettingsDropdown_dropdown'>
					{this.props.items.map(item => this.renderItem(item))}
				</div>
			);
		} else {
			return null;
		}
	}
	render() {
		return (
			<div
				className='bSettingsDropdown'
				onBlur={() => this.handleBlur()}
			>
				<button
					className='eSettingsDropdown_selected'
					onClick={() => this.handleClick()}
					onBlur={() => this.handleBlur()}
				>
					<i className="fa fa-cog" aria-hidden="true"/>
				</button>
				<div
					className='eSettingsDropdown_triangle'
					onClick={() => this.handleClick()}
					onBlur={() => this.handleBlur()}
				/>
				{this.renderDropdown()}
			</div>
		);
	}
}