/**
 * Created by wert on 02.09.16.
 */

import * as React from 'react';

interface ChooseFileItemProps {
	name?: 		string
	className?:	string
	onChange?: 	() => void
}
/** Menu item which when clicked show file chooser dialog */
export class ChooseFileItem extends React.Component<ChooseFileItemProps> {
	render() {
		return (
			<span className={this.props.className}>
			{this.props.name}
				<input onChange={this.props.onChange} type='file' />
		</span>
		);
	}
}