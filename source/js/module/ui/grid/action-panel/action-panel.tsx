/**
 * Created by Anatoly on 24.07.2016.
 */

import * as React from 'react';
import * as SVG from 'module/ui/svg';
import {ActionPanelModel} from "module/ui/grid/action-panel/action-panel-model";

export interface ActionPanelProps {
    model: ActionPanelModel
}

export interface ActionPanelState {
    isFilterActive?: boolean
}

export class ActionPanel extends React.Component<ActionPanelProps, ActionPanelState> {
    toggleFilters(e) {
		const {model} = this.props;

		model.toggleFilters();
		// TODO Why do you change "isFilterActive" in state?
		// Why isn't it enough change "isFilterActive" only in model?("toggleFilters" function change model.)
		// And where do you use state?
		this.setState({isFilterActive: model.isFilterActive});

		e.stopPropagation();
	}

    isShowCSVButtonExport () {
        return typeof this.props.model.btnCSVExport !== 'undefined';
    }

	render(){
        const {model} = this.props;

        const optTitle = !!model.title ? <h1 className="eTitle">{model.title}</h1> : null;
        const optStrip = !!model.showStrip ? <div className="eStrip"></div> : null;
        const optAddButton = !!model.btnAdd ? model.btnAdd : null;
        const optCsvButton = this.isShowCSVButtonExport() ? model.btnCSVExport : null;

        let optFilter = null;
        if(!model.hideBtnFilter) {
            optFilter = (
                <div className="filter_btn bTooltip" data-description="Filter" onClick={e => this.toggleFilters(e)}>
                    <SVG icon="icon_search"/> {model.isFilterActive ? '↑' : '↓'}
                </div>
            );
        }

		return (
			<div className="bActionPanel">
                {optTitle}
				{optStrip}
                {optFilter}
                {optAddButton}
                {optCsvButton}
			</div>
		);
    }
}