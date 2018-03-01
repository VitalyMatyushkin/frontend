// main components
import * as React from 'react';

// components
import {CheckboxListItem} from "module/ui/checkbox_list/checkbox_list_item/checkbox_list_item";

// models
import {Item} from "module/ui/checkbox_list/models/item";

// styles
import 'styles/ui/b_checkbox_list.scss'


export interface CheckboxListBodyProps {
	items: Item[]
	handleClickItemCheckbox: (id: string) => void
}

export class CheckboxListBody extends React.Component<CheckboxListBodyProps, {}> {
	renderItemList() {
		return this.props.items.map(item =>
			<CheckboxListItem key={item.id} item={item} handleClickItemCheckbox={this.props.handleClickItemCheckbox}/>
		);
	}
	render() {
		return (
			<div className='eCheckboxList_body'>
				{this.renderItemList()}
			</div>
		);
	}
}