import * as React from 'react';

export interface CancelEventProps {
	handleClickCheckboxMode: () => any
}

export class CancelEvent extends React.Component<CancelEventProps, {}> {

	render() {
		return (
			<div>
				You are going to cancel the fixture. Are you sure?
				<div className="bSmallCheckboxBlock">
					<div className="eForm_fieldInput mInline">
						<input
							className	= "eSwitch"
							type		= "checkbox"
							onChange	= { () => this.props.handleClickCheckboxMode() }
						/>
						<label/>
					</div>
					<div className="eSmallCheckboxBlock_label">
						User manual notification mode
					</div>
				</div>
			</div>
		);
	}
}