import * as React from 'react';

const Style = require('styles/ui/b_split_button.scss');

interface MainButtonProps {
	handleClick: () => void
	handleBlur: () => void
	isDisabled?: boolean
}

export class SecondaryButton extends React.Component<MainButtonProps, {}> {
	getButtonStyle() {
		let style = 'eSplitButton_secondaryButton';
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
				onBlur = { this.props.handleBlur }
				disabled = { this.isDisabled() }
			>
				<i className="fa fa-caret-down" aria-hidden="true"/>
			</button>
		);
	}
}