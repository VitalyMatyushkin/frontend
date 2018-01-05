/**
 * Created by vitaly on 05.01.18.
 */

import {DataLoader}     from 'module/ui/grid/data-loader';
import {GridModel}      from 'module/ui/grid/grid-model';

export class NotificationsModel{
	getDefaultBinding: any;
	getMoreartyContext: any;
	props: any;
	state: any;
	rootBinding: any;
	columns: any[];
	actionDescriptionId: string;
	grid: GridModel;
	dataLoader: DataLoader;
	
	constructor(page: any){
		this.getDefaultBinding = page.getDefaultBinding;
		this.getMoreartyContext = page.getMoreartyContext;
		this.props = page.props;
		this.state = page.state;
		
		this.rootBinding = this.getMoreartyContext().getBinding();
		this.actionDescriptionId = this.rootBinding.get('routing.pathParameters.0');
		this.setColumns();
	}
	
	setColumns(){
		this.columns = [
			{
				text:'Id',
				cell:{
					dataField:'id',
					type: 'general'
				}
			},
			{
				text:'Title',
				cell:{
					dataField:'title',
					type: 'general'
				}
			},
			{
				text:'Type',
				cell:{
					dataField:'type',
					type: 'general'
				}
			},
			{
				text:'Delivery status',
				cell:{
					dataField:'deliveryStatus',
					type: 'general'
				}
			},
			{
				text:'Created at',
				cell:{
					dataField:'createdAt',
					type: 'date'
				},
				filter:{
					type:'between-date'
				}
			}
		];
	}
	
	init(): any {
		this.grid = new GridModel({
			actionPanel:{
				title:      'Notifications',
				showStrip:  true
			},
			columns:this.columns,
			filters:{limit:20, order:'startedAt DESC', where: {actionDescriptorId: this.actionDescriptionId}
			}
		});
		
		this.dataLoader =   new DataLoader({
			serviceName:'allNotifications',
			grid:       this.grid,
			onLoad:     this.getDataLoadedHandle()
		});
		
		return this;
	};
	
	getDataLoadedHandle() {
		const binding = this.getDefaultBinding();
		
		return data => {
			binding.set('data', this.grid.table.data);
		};
	};
}