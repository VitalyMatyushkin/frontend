/**
 * Created by vitaly on 04.01.18.
 */

import {DataLoader} from 'module/ui/grid/data-loader';
import {GridModel} from 'module/ui/grid/grid-model';

import {ActionDescriptor} from './action-descriptor-item';

/**
 * UserActivityModel
 *
 * @param {object} page
 *
 **/
export class ActionDescriptorsModel{
	
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
	
	getUserName(item: ActionDescriptor): string {
		let name = '';
		
		if (typeof item.triggeredBy !== 'undefined'){
			const 	firstName = typeof item.triggeredBy.firstName !== 'undefined' ? item.triggeredBy.firstName : '',
					lastName = typeof item.triggeredBy.lastName !== 'undefined' ? item.triggeredBy.lastName : '';
			name = `${firstName} ${lastName}`;
		}
		
		return name;
	}
	
	getAffectedUserListCount(item: ActionDescriptor): number {
		return item.affectedUserList.length;
	}
	
	getUsersToNotifyListCount(item: ActionDescriptor): number {
		return item.usersToNotifyList.length;
	}
	
	handleClickActionDescriptor(id: string): void {
		window.location.hash = `users/action_descriptor/${id}/item`;
		event.stopPropagation();
	}
	
	setColumns(): void {
		this.columns = [
			{
				text:'Name',
				isSorted:false,
				cell:{
					type:'custom',
					typeOptions:{
						parseFunction:this.getUserName.bind(this)
					}
				}
			},
			{
				text:'Affected User List',
				isSorted:false,
				cell:{
					type:'custom',
					typeOptions:{
						parseFunction:this.getAffectedUserListCount.bind(this)
					}
				}
			},
			{
				text:'Affected User List Status',
				isSorted:false,
				cell:{
					dataField:'affectedUserListStatus'
				}
			},
			{
				text:'Users To Notify List',
				isSorted:false,
				cell:{
					type:'custom',
					typeOptions:{
						parseFunction:this.getUsersToNotifyListCount.bind(this)
					}
				}
			},
			{
				text:'Manual Confirmation Status',
				isSorted:false,
				cell:{
					dataField:'manualConfirmationStatus'
				}
			},
			{
				text:'Notification Emission Status',
				isSorted:false,
				cell:{
					dataField:'notificationEmissionStatus'
				}
			},
			{
				text:'Kind',
				isSorted:false,
				cell:{
					dataField:'kind'
				},
				filter:{
					type:'string'
				}
			}
		];
	}
	
	createGrid(): any {
		this.grid = new GridModel({
			actionPanel:{
				title:      'Action Descriptors',
				showStrip:  true
			},
			columns:this.columns,
			handleClick: this.handleClickActionDescriptor.bind(this),
			filters:{limit:20, order:'createdAt DESC'}
		});
		
		this.dataLoader =   new DataLoader({
			serviceName:'actionDescriptors',
			grid:       this.grid,
			onLoad:     this.getDataLoadedHandle()
		});
		
		return this;
	}
	
	createGridFromExistingData(grid: GridModel): any {
		this.grid = new GridModel({
			actionPanel:{
				title:      'Action Descriptors',
				showStrip:  true
			},
			columns:this.columns,
			handleClick: this.handleClickActionDescriptor.bind(this),
			filters: {
				where: grid.filter.where,
				order: grid.filter.order
			},
			badges: grid.filterPanel.badgeArea
		});
		
		this.dataLoader =   new DataLoader({
			serviceName:'actionDescriptors',
			grid:       this.grid,
			onLoad:     this.getDataLoadedHandle()
		});
		
		return this;
	}
	
	getDataLoadedHandle() {
		const binding = this.getDefaultBinding();
		
		return data => {
			binding.set('data', this.grid.table.data);
		};
	};
}