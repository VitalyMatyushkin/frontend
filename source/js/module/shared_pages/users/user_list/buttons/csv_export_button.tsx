import * as React from 'react';

export interface CSVExportButtonProps {
	handleClick: any
}

export class CSVExportButton extends React.Component<CSVExportButtonProps, {}> {
	render() {
		return (
			<div
				className	= "bCSVDownloadButton"
				onClick		= { (e) => { this.props.handleClick(e) } }
			>
			</div>
		);
	}
};