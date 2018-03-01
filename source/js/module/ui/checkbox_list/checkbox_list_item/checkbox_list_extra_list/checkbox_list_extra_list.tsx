// main components
import * as React from 'react';

// components
import {CheckboxListExtraListItem} from "module/ui/checkbox_list/checkbox_list_item/checkbox_list_extra_list/checkbox_list_extra_list_item";
import {ExtraItem} from "module/ui/checkbox_list/models/extra_item";

// styles
import 'styles/ui/b_checkbox_list.scss'

export interface CheckboxListExtraListProps {
	extraItems: ExtraItem[]
}

export class CheckboxListExtraList extends React.Component<CheckboxListExtraListProps, {}> {
	render() {
		return (
			<div className='eParentsCheckboxList_extraList'>
				{this.props.extraItems.map(extraItem => <CheckboxListExtraListItem key={extraItem.id} extraItem={extraItem}/>)}
			</div>
		);
	}
}