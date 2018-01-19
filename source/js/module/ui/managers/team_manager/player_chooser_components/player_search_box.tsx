import * as React from 'react'

export interface PlayerSearchBoxProps {
	handleChangeSearchText: (text: string) => void
}

export class PlayerSearchBox extends React.Component<PlayerSearchBoxProps, {}> {
	handleChangeSearchText(eventDescriptor) {
		this.props.handleChangeSearchText(eventDescriptor.target.value);
	}
	handleKeyPress(eventDescriptor) {
		if (eventDescriptor.key === 'Enter') {
			this.props.handleChangeSearchText(eventDescriptor.target.value);
		}
	}
	render() {
		return (
			<div className="ePlayerChooser_playerSearchBox">
				<input
					id="searchPlayer_input"
					className="ePlayerChooser_playerSearchBoxInput"
					placeholder="Enter student name"
					onChange={(eventDescriptor) => this.handleChangeSearchText(eventDescriptor)}
					onKeyPress ={(eventDescriptor) => this.handleKeyPress(eventDescriptor)}
				/>
			</div>
		);
	}
};