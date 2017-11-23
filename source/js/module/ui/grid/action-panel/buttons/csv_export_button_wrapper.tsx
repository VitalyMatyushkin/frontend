import * as React from 'react';

export interface CSVExportButtonWrapperProps {
    model: any
    handleClick: () => any
}

export class CSVExportButtonWrapper extends React.Component<CSVExportButtonWrapperProps, {}> {
    render() {
        const {model, handleClick} = this.props;

        const CSVExportButton = model.btnCSVExport;

        return (
            <CSVExportButton
                handleClick = { handleClick }
            />
        );
    }
}