// main components
import * as React from 'react'

// components
import {CheckboxListItemText} from "module/ui/checkbox_list/checkbox_list_item/checkbox_list_item_text";
import {CheckboxListExtraList} from "module/ui/checkbox_list/checkbox_list_item/checkbox_list_extra_list/checkbox_list_extra_list";
import * as Checkbox from 'module/ui/checkbox/checkbox';

// models
import {Item} from "module/ui/checkbox_list/models/item";

// styles
import 'styles/ui/b_checkbox_list.scss'

export interface CheckboxListItemProps {
	item: Item
	handleClickItemCheckbox: (id: string) => void
}

export class CheckboxListItem extends React.Component<CheckboxListItemProps, {}> {
	render() {
		const item = this.props.item;

		return (
			<div className='eCheckboxList_item'>
				<div className='eCheckboxList_textSide'>
					<CheckboxListItemText item={item}/>
					<CheckboxListExtraList extraItems={item.extraItems}/>
				</div>
				<div className='eCheckboxList_checkBoxSide'>
					<Checkbox
						isChecked={item.checked}
						onChange={() => this.props.handleClickItemCheckbox(item.id)}
					/>
				</div>
			</div>
		);
	}
}