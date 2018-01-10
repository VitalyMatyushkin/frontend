import * as React from 'react';

const Style = require('styles/ui/b_split_button.scss');

interface MainButtonProps {
	text: string
	handleClick: () => void
	isDisabled?: boolean
}

export class MainButton extends React.Component<MainButtonProps, {}> {
	getButtonStyle() {
		let style = 'eSplitButton_mainButton';
		if(!!this.props.isDisabled) {
			style += ' mDisable';
		}

		return style;
	}

	isDisabled() {
		let isDisabled: boolean = false;
		if(typeof this.props.isDisabled !== 'undefined') {
			isDisabled = this.props.isDisabled;
		}

		return isDisabled;
	}

	render() {
		return (
			<button
				className = { this.getButtonStyle() }
				onClick = { this.props.handleClick }
				disabled = { this.isDisabled() }
			>
				{ this.props.text }
			</button>
		);
	}
}