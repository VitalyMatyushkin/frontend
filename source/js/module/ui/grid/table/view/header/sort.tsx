/**
 * Created by Anatoly on 20.07.2016.
 */

import * as React from 'react';

export interface SortProps {
    model: {
        onSort:     (dataField) => void,
        dataField:  string,
        value:      any
    }
    dataField: string
}

export class Sort extends React.Component<SortProps, {}> {

    onClick(e){
        const {model, dataField} = this.props;
		model.onSort && model.onSort(dataField);
        e.stopPropagation();
    }

    render () {
        const {model, dataField} = this.props;

		const
				value 	= model.dataField === dataField ? model.value : null,
				classes = value ? 'eSort m' + value : 'eSort';

        return (
            <span className={classes} onClick={e => this.onClick(e)}/>
        );
    }
}