/**
 * Created by Anatoly on 21.07.2016.
 */


import {ActionPanel} from './action-panel/action-panel';
import {FilterPanel} from './filter/filter-panel/filter-panel';
import {Table} from './table/view/table';
import {Pagination}	from './filter/pagination';
import * as React from 'react';

import * as CSVExportController from 'module/ui/grid/csv_export/csv_export_controller';
import {ActionPanelModel} from "module/ui/grid/action-panel/action-panel-model";
import {PaginationModel} from "module/ui/grid/filter/model/pagination-model";

export interface GridProps {
    model: 	{
        onRender: () => void,
        classStyleAdmin: any
        handleClick?: (itemId: string, itemName: string) => void
        actionPanel: ActionPanelModel
        filterPanel: any
        table:  {
            data: any[]
            columns: any[]
        }
        pagination: PaginationModel
    },
    id:     string
}

export interface GridState {
    renderStart?: Date
}

export class Grid extends React.Component<GridProps, GridState> {

	componentWillMount(){
		this.props.model.onRender = () => this.onRender();
	}

	componentWillUnmount(){
		this.props.model.onRender = null;
	}

	/**start re-render. Model use it for re-render component*/
	onRender(){
		this.setState({renderStart: new Date()});
	}

	handleClickCSVExportButton(): void {
		CSVExportController.getCSVByGridModel(this.props.model);
	}

	emptyClickHandler(itemId: string, itemName: string): void {
        console.warn('Warning: There is no function in grid for click on row');
    }

	render() {
		const {id, model}	= this.props;
		const	classStyleAdmin	= model.classStyleAdmin ? ' bGrid-wide' : '',
				//The function, which will call when user click on <Row> in Grid otherwise we display in console log warning
				handleClick		= model.handleClick ? (itemId: string, itemName: string): void => model.handleClick(itemId, itemName) : this.emptyClickHandler,
				mHidden			= !model.actionPanel.isFilterActive ? 'mHidden' : null;

		return (
			<div className={"bGrid" + classStyleAdmin} id={id}>
				<ActionPanel
					model						= { model.actionPanel }
					handleClickCSVExportButton	= { this.handleClickCSVExportButton }
				/>
				<div className={mHidden}>
					<FilterPanel model={model.filterPanel} />
				</div>
				<Table model={model.table} handleClick={handleClick} />
				<Pagination model={model.pagination} />
			</div>
		);
	}
}