/**
 * Created by vitaly on 07.12.17.
 */

import * as React from 'react';
import * as classNames from 'classnames';
import * as Loader from 'module/ui/loader';
import '../../../../styles/ui/b_button.scss';

interface ButtonProps {
	id?:				string				// html id
	key?:				string
	text:				string | string[]	// text to display in button
	onClick:			() => void			// function to be called on click
	extraStyleClasses?:	string				// if one need to add extra styles to button.
	isDisabled?:		boolean
	isLoading?:         boolean
}

export class Button extends React.Component<ButtonProps> {
	isLoading() {
		let isLoading = false;

		if(typeof this.props.isLoading !== 'undefined') {
			isLoading = this.props.isLoading;
		}

		return isLoading;
	}
	isDisabled() {
		let isDisabled: boolean = false;
		if(typeof this.props.isDisabled !== 'undefined') {
			isDisabled = this.props.isDisabled;
		}

		return isDisabled;
	}
	getButtonClassName() {
		return classNames('bButton', this.props.extraStyleClasses || '', { mDisable: this.isLoading() || this.isDisabled()} );
	}
	getView() {
		let view = null;
		switch (true) {
			case this.isLoading(): {
				view = (
					<div className='eButton_textContainer'>
						<div className='eButton_loaderContainer'>
							<Loader />
						</div>
						<div className='eButton_text'>
							{this.props.text}
						</div>
					</div>
				);
				break;
			}
			default: {
				view = (
					<div className='eButton_textContainer'>
						<div className='eButton_text'>
							{this.props.text}
						</div>
					</div>
				);
				break;
			}
		}

		return view;
	}
	render() {

		
		return (
			<button
				id			= { this.props.id }
				className	= { this.getButtonClassName() }
				disabled	= { this.isDisabled() }
				onClick		= { () => this.props.onClick() }
			>
				{ this.getView() }
			</button>
		);
	}
}