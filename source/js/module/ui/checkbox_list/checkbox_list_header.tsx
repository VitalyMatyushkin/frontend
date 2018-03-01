// main components
import * as React from 'react'

// styles
import 'styles/ui/b_checkbox_list.scss'

export interface CheckboxListHeaderProps {
	title: string
}

export class CheckboxListHeader extends React.Component<CheckboxListHeaderProps, {}> {
	render() {
		return (
			<h1 className='eCheckboxList_header'>
				{this.props.title}
			</h1>
		);
	}
}