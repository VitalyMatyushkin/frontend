/**
 * Created by vitaly on 07.12.17.
 */

import * as React	from 'react';
import '../../../../styles/ui/b_button.scss';

interface ButtonProps {
	id?:				string				// html id
	key?:				string
	text:				string | string[]	// text to display in button
	onClick:			() => void			// function to be called on click
	extraStyleClasses?:	string				// if one need to add extra styles to button.
	isDisabled?:			boolean
}

export class Button extends React.Component<ButtonProps> {
	render() {
		const	extraStyleClasses	= this.props.extraStyleClasses || '',
				className			= `bButton ${extraStyleClasses}`;
		
		let isDisabled: boolean = false;
		if(typeof this.props.isDisabled !== 'undefined') {
			isDisabled = this.props.isDisabled;
		}
		
		return (
			<button
				id			= {this.props.id}
				className	= {className}
				disabled	= {isDisabled}
				onClick		= {() => this.props.onClick()}
			>
				{this.props.text}
			</button>
		);
	}
}