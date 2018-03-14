/**
 * Created by Anatoly on 09.08.2016.
 */

import * as React from 'react';
import * as classNames from 'classnames';
import {Item as MultiselectItem, MultiselectReact} from 'module/ui/multiselect-react/multiselect';

interface Badge {
	values: Array<{ key: string }>
}

interface _FilterField {
	id: string
	typeOptions: _FilterFieldTypeOptions
	onChange?: (items: MultiselectItem[]) => void
	getBadge: () => Badge
}


interface _FilterFieldTypeOptions {
	getDataPromise: Promise<any[]>
	valueField: string
	keyField: string
	items: MultiselectItem[]
	hideFilter: boolean
	hideButtons: boolean
}

export interface FilterMultiSelectTypeProps {
    filterField: _FilterField
}

interface FilterMultiSelectTypeState {
    model?: MultiSelectModel
}

export class FilterMultiSelectType extends React.Component<FilterMultiSelectTypeProps, FilterMultiSelectTypeState>{
    model: MultiSelectModel;

	componentWillMount() {
		this.model = new MultiSelectModel(this.props.filterField);
		this.model.onLoad = () => this.onLoad();
		this.model.loadData();
	}

	onLoad(): void {
		this.setState({model:this.model});
	}

	onChange(selections: string[]): void {
		this.model.setSelections(selections);
		this.setState({model: this.model});
	}

	render() {
		const 	model 		= this.model,
				items 		= model.items,
				selections 	= model.getSelections(),
				id			= model.filterField.id,
				classes = classNames({
					mHideFilter: model.hideFilter,
					mHideButtons: model.hideButtons
				});

		return (
			<MultiselectReact items={items} selections={selections} onChange={selections => this.onChange(selections)} id={id} className={classes} />
		);
	}
}


class MultiSelectModel {

    filterField: _FilterField;
    getDataPromise: Promise<any[]>;
    valueField: string;
    keyField: string;
    items: MultiselectItem[];
    hideFilter: boolean;
    hideButtons: boolean;
    onLoad: () => void;

    constructor(filterField: _FilterField) {
        const options = filterField.typeOptions;

        this.filterField = filterField;
        this.getDataPromise = options.getDataPromise;
        this.valueField = options.valueField;
        this.keyField = options.keyField;
        this.items = options.items || [];
        this.hideFilter = !!options.hideFilter;
        this.hideButtons = !!options.hideButtons;

        this.onLoad = null;
    }

    loadData(): void {
        this.getDataPromise && this.getDataPromise.then(data => {
            const result: MultiselectItem[] = [];
            data && data.forEach(item => {
                result.push({
                    key: item[this.keyField],
                    value: item[this.valueField]
                });
            });

            this.items = result;
            this.onLoad && this.onLoad();
        });
    }

    setSelections(selections: string[]): void {
        const result = this.items.filter(item => selections.indexOf(item.key) !== -1);
        this.filterField.onChange(result);
    }

    getSelections(){
        const badge = this.filterField.getBadge();

        return badge && badge.values ? badge.values.map(item => item.key) : [];
    }
}
