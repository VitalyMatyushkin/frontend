import * as React from 'react';

const Style = require('styles/ui/b_split_button.scss');

interface SecondaryButtonProps {
	handleClick: () => void
	handleBlur: () => void
	isDisabled?: boolean
}

export interface SecondaryButtonState {
	isMarked: boolean
}

export class SecondaryButton extends React.Component<SecondaryButtonProps, SecondaryButtonState> {
	componentWillMount(){
		this.setState({isMarked: false});
	}

	getButtonStyle() {
		let style = 'eSplitButton_secondaryButton';
		if(!!this.props.isDisabled) {
			style += ' mDisable';
		}

		if(!!this.state.isMarked) {
			style += ' mMarked';
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

	handleClick() {
		this.props.handleClick();

		this.setState({isMarked: !this.state.isMarked});
	}

	handleBlur() {
		this.props.handleBlur();

		this.setState({isMarked: false});
	}

	render() {
		return (
			<button
				className = { this.getButtonStyle() }
				onClick = { () => this.handleClick() }
				onBlur = { () => this.handleBlur() }
				disabled = { this.isDisabled() }
			>
				<i className="fa fa-caret-down" aria-hidden="true"/>
			</button>
		);
	}
}