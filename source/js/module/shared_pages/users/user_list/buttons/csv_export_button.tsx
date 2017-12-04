import * as React from 'react';

export interface CSVExportButtonProps {
	handleClick: any
}

export class CSVExportButton extends React.Component<CSVExportButtonProps, {}> {
	render() {
		return (
			<div
				className			= "bCSVDownloadButton bTooltip"
				onClick				= { (e) => { this.props.handleClick(e) } }
				data-description	= "Download CSV"
			>
			</div>
		);
	}
};