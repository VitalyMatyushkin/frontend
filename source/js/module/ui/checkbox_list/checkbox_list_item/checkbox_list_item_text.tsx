// main components
import * as React from 'react'

// models
import {Item} from "module/ui/checkbox_list/models/item";

// styles
import 'styles/ui/b_checkbox_list.scss'

export interface CheckboxListItemTextProps {
	item: Item
}

export class CheckboxListItemText extends React.Component<CheckboxListItemTextProps, {}> {
	render() {
		return (
			<div className='eCheckboxList_itemText'>
				{this.props.item.text}
			</div>
		);
	}
}