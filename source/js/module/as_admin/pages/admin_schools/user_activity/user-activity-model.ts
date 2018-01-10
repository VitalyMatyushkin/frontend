/**
 * Created by Anatoly on 21.11.2016.
 */

import {DataLoader} from 'module/ui/grid/data-loader';
import {GridModel} from 'module/ui/grid/grid-model';
import * as Timezone from 'moment-timezone';

interface _Item {
    user: {
        firstName: string
        lastName: string
    }
}

/**
 * UserActivityModel
 *
 * @param {object} page
 *
 **/
export class UserActivityModel{

    getDefaultBinding: any;
    getMoreartyContext: any;
    props: any;
    state: any;
    rootBinding: any;
    columns: any[];
    grid: GridModel;
    dataLoader: DataLoader;

    constructor(page: any){
        this.getDefaultBinding = page.getDefaultBinding;
        this.getMoreartyContext = page.getMoreartyContext;
        this.props = page.props;
        this.state = page.state;

        this.rootBinding = this.getMoreartyContext().getBinding();

        this.setColumns();
    }

    getUserName(item: _Item): string {
        let name = '';

        if (typeof item.user !== 'undefined'){
            name = item.user.firstName + ' ' + item.user.lastName;
        }

        return name;
    }

    getDateTime(item: any): string {
        return Timezone.tz(item.finishedAt, (<any>window).timezone).format('DD.MM.YY/HH:mm:ss');
    }

    getMethodList(){
        return [
            {
                key:'GET',
                value:'GET'
            },
            {
                key:'PUT',
                value:'PUT'
            },
            {
                key:'DELETE',
                value:'DELETE'
            },
            {
                key:'POST',
                value:'POST'
            }
        ];
    }

    setColumns(): void {
        this.columns = [
            {
                text:'',
                isSorted:false,
                cell:{
                    dataField:'user.avatar',
                    type:'image'
                }
            },
            {
                text:'Name',
                isSorted:false,
                cell:{
                    type:'custom',
                    typeOptions:{
                        parseFunction:this.getUserName.bind(this) // If without .bind did it, then return UserActivityModel
                    }
                }
            },
            {
                text:'IP adress',
                isSorted:false,
                cell:{
                    dataField:'httpHeaders.x-real-ip',
                    type:'general'
                },
                filter:{
                    type:'string'
                }
            },
            {
                text:'Email',
                isSorted:true,
                width:'150px',
                cell:{
                    dataField:'userEmail',
                    type:'email'
                },
                filter:{
                    type:'string'
                }
            },
            {
                text:'Method',
                isSorted:true,
                cell:{
                    dataField:'httpVerb'
                },
                filter:{
                    type:'multi-select',
                    typeOptions:{
                        items: this.getMethodList(),
                        hideFilter:true,
                        hideButtons:true
                    }
                }
            },
            {
                text:'Url',
                isSorted:true,
                width:'370px',
                cell:{
                    dataField:'httpUrl',
                    type:'url'
                },
                filter:{
                    type:'string'
                }
            },
            {
                text:'Status',
                isSorted:true,
                cell:{
                    dataField:'httpStatusCode'
                }
            },
            {
                text:'Finished',
                isSorted:true,
                cell:{
                    dataField:'finishedAt',
                    type:'custom',
                    typeOptions:{
                        parseFunction: this.getDateTime.bind(this) // If without .bind did it, then return UserActivityModel
                    }
                },
                filter:{
                    type:'between-date-time'
                }
            }
        ];
    }

    init(){

        this.grid = new GridModel({
            actionPanel:{
                title:      'User Activity',
                showStrip:  true
            },
            columns:this.columns,
            filters:{limit:20, order:'startedAt DESC'}
        });

        this.dataLoader =   new DataLoader({
            serviceName:'useractivity',
            grid:       this.grid,
            onLoad:     this.getDataLoadedHandle()
        });

        return this;
    };

    getDataLoadedHandle(){
        const binding = this.getDefaultBinding();

        return data => {
            binding.set('data', this.grid.table.data);
        };
    };
}

