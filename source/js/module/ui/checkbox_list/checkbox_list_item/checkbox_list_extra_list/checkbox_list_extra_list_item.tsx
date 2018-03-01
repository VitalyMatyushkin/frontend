// main components
import * as React from 'react';

// components
import {ExtraItem} from "module/ui/checkbox_list/models/extra_item";

// styles
import 'styles/ui/b_checkbox_list.scss'

export interface CheckboxListExtraListItemProps {
	extraItem: ExtraItem
}

export class CheckboxListExtraListItem extends React.Component<CheckboxListExtraListItemProps, {}> {
	render() {
		return (
			<div className='eParentsCheckboxList_extraListItem'>
				{this.props.extraItem.text}
			</div>
		);
	}
}