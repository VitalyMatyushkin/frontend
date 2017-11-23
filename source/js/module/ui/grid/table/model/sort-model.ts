/**
 * Created by Anatoly on 26.07.2016.
 */

export class SortModel {

    dataField: any;
    value: 'ASC' | 'DESC';
    onChange: (dataField: any, value: string) => any;

    constructor(onChangeHandler: (dataField: any, value: string) => any) {
        this.dataField = null;
        this.value = null;

        this.onChange = onChangeHandler;
    }

    onSort(dataField){
        if(this.dataField === dataField){
            this.value = this.value === 'ASC' ? 'DESC' : 'ASC';
        }else{
            this.dataField = dataField;
            this.value = 'ASC';
        }

        this.onChange && this.onChange(this.dataField, this.value);
    };
}

