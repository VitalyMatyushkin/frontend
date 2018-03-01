// main components
import * as React from 'react'

// components
import {CheckboxListHeader} from "module/ui/checkbox_list/checkbox_list_header";
import {CheckboxListBody} from "module/ui/checkbox_list/checkbox_list_body";

// models
import {Item} from "module/ui/checkbox_list/models/item";

// styles
import 'styles/ui/b_checkbox_list.scss'

export interface CheckboxListProps {
	title: string,
	items: Item[]
	handleClickItemCheckbox: (id: string) => void
}

export class CheckboxList extends React.Component<CheckboxListProps, {}> {
	render() {
		return (
			<div className='bCheckboxList'>
				<CheckboxListHeader title={this.props.title}/>
				<CheckboxListBody
					items={this.props.items}
					handleClickItemCheckbox={this.props.handleClickItemCheckbox}
				/>
			</div>
		);
	}
}