/**
 * Created by Anatoly on 09.08.2016.
 */

import * as React from 'react';
import * as classNames from 'classnames';
import * as MultiSelect from 'module/ui/multiselect-react/multiselect';

export interface FilterMultiSelectTypeProps {
    filterField: any
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

	onLoad(){
		this.setState({model:this.model});
	}

	onChange(data){
		this.model.setSelections(data);
		this.setState({model:this.model});
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
			<MultiSelect items={items} selections={selections} onChange={(data) => this.onChange(data)} id={id} className={classes} />
		);
	}
}

interface _FilterFieldTypeOptions {
    getDataPromise: any
    valueField: any
    keyField: any
    items: any[]
    hideFilter: boolean
    hideButtons: boolean
}

interface _FilterField {
    id: any
    typeOptions: _FilterFieldTypeOptions
    onChange?: any
    getBadge: () => any

}


class MultiSelectModel {

    filterField: _FilterField;
    getDataPromise: any;
    valueField: any;
    keyField: any;
    items: any[];
    hideFilter: boolean;
    hideButtons: boolean;
    onLoad: any;

    constructor(filterField){
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
            const result = [];
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

    setSelections(data): void{
        const result = this.items.filter(item => data.indexOf(item.key) !== -1);
        this.filterField.onChange(result);
    }

    getSelections(){
        const badge = this.filterField.getBadge();

        return badge && badge.values ? badge.values.map(item => item.key) : [];
    }
}
