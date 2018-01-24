/**
 * Created by vitaly on 27.11.17.
 */

import {DataLoader}     from 'module/ui/grid/data-loader';
import {GridModel}      from 'module/ui/grid/grid-model';
import * as RoleHelper  from 'module/helpers/role_helper';
import * as Timezone    from 'moment-timezone';

/**
 * SessionsModel
 *
 * @param {object} page
 *
 **/

interface _Item {
    appDetails: {
        appName: string
        appVersion: string
    }
}

export class SessionsModel {
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

    getRoleList() {
        const roles = [];

        Object.keys(RoleHelper.USER_PERMISSIONS).forEach( key => {
            roles.push({
                key: key,
                value: RoleHelper.USER_PERMISSIONS[key].toLowerCase()
            });
        });

        return roles;
    }

    getCreatedAtDateTime(item: any): string {
        return Timezone.tz(item.createdAt, (<any>window).timezone).format('HH:mm:ss DD.MM.YY');
    }

    getExpireAtDateTime(item: any): string {
        return Timezone.tz(item.expireAt, (<any>window).timezone).format('HH:mm:ss DD.MM.YY');
    }

    getAppDetails(item: _Item): string {
        return item.appDetails ? `${item.appDetails.appName}/${item.appDetails.appVersion}` : '';
    }

	onRemove(session, eventDescriptor: any) {
		(<any>window).confirmAlert(
			`Are you sure you want to remove session?`,
			"Ok",
			"Cancel",
			() => (<any>window).Server.userSession
				.delete(
					{
						userId: this.props.userId,
						sessionKey: session.key
					}
				)
				.then(() => this.dataLoader.loadData()),
			() => {}
		);
		eventDescriptor.stopPropagation();
	}

    setColumns(): void {
        this.columns = [
            {
                text:'Role',
                isSorted:false,
                cell:{
                    dataField:'role',
                    type: 'general'
                },
                filter:{
                type:'multi-select',
                    typeOptions:{
                    items: this.getRoleList(),
                        hideFilter:true
                    }
                }
            },
            {
                text:'Created at',
                isSorted: false,
                cell:{
                    dataField:'createdAt',
                    type:'custom',
                    typeOptions:{
                        parseFunction: this.getCreatedAtDateTime.bind(this)
                    }
                },
                filter:{
                    type:'between-date'
                }
            },
            {
                text:'Expire at',
                isSorted:false,
                cell:{
                    dataField:'expireAt',
                    type:'custom',
                    typeOptions:{
                        parseFunction: this.getExpireAtDateTime.bind(this)
                    }
                },
                filter:{
                    type:'between-date'
                }
            },
            {
                text:'App details',
                isSorted:false,
                cell:{
                    dataField:'appDetails',
                    type:'custom',
                    typeOptions:{
                        parseFunction: this.getAppDetails.bind(this)
                    }
                }
            },
	        {
		        text: 'Actions',
		        cell: {
			        type: 'action-buttons',
			        typeOptions: {
				        onItemRemove: this.onRemove.bind(this)
			        }
		        }
	        }
        ];
    }

    init(){
	    this.grid = new GridModel({
            actionPanel: {
                title:      'Sessions',
                showStrip:  true
            },
            columns: this.columns,
            filters: {limit: 20},
            uniqueField: 'key'
        });

        this.dataLoader =   new DataLoader({
            serviceName:'userSessions',
            params: 	{userId: this.props.userId},
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