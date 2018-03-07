/**
 * Created by vitaly on 19.12.17.
 */

import {DataLoader} from 'module/ui/grid/data-loader';
import {GridModel} from 'module/ui/grid/grid-model';
import * as React from 'react';
import * as Timezone from 'moment-timezone';
import * as CSVExportConsts from 'module/ui/grid/csv_export/consts';
import * as CSVExportController from'module/ui/grid/csv_export/csv_export_controller';
/**
 * UserStatisticsModel
 *
 * @param {object} page
 *
 **/
export class UserStatsModel{
	
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
	
	getFirstHitTime(item: any): string {
		return item.firstHit ? Timezone.tz(item.firstHit, (window as any).timezone).format('DD.MM.YY hh:mm:ss') : '';
	}
	
	getLastHitTime(item: any): string {
		return item.lastHit ? Timezone.tz(item.lastHit, (window as any).timezone).format('DD.MM.YY hh:mm:ss'): '';
	}

	getPermissionList(item: any) {
		return item.user.permissionList.map( (permissionPreset, index) => {
			return <div key={index}>{permissionPreset}</div>
		})
	}
	
	setColumns(): void {
		this.columns = [
			{
				text:'Email',
				isSorted:false,
				cell:{
					dataField:'user.email',
					type:'general'
				}
			},
			{
				text:'Name',
				isSorted:false,
				cell:{
					dataField:'user.firstName',
					type:'general'
				}
			},
			{
				text:'Surname',
				isSorted:false,
				cell:{
					dataField:'user.lastName',
					type:'general'
				}
			},
			{
				text:'FirstHit',
				isSorted:false,
				cell:{
					dataField:'firstHit',
					type:'custom',
					typeOptions:{
						parseFunction: this.getFirstHitTime.bind(this)
					}
				}
			},
			{
				text:'LastHit',
				isSorted:false,
				cell:{
					dataField:'lastHit',
					type:'custom',
					typeOptions:{
						parseFunction: this.getLastHitTime.bind(this)
					}
				}
			},
			{
				text:'Data',
				hidden:true,
				cell:{
					dataField:'startedAt',
					type:'date'
				},
				filter:{
					type:'between-date-time'
				}
			},
			{
				text:'CountHit',
				isSorted:true,
				cell:{
					dataField:'countHit',
					type:'general'
				}
			},
			{
				text:'PermissionList',
				cell:{
					dataField:'user.permissionList',
					type:'custom',
					typeOptions: {
						parseFunction: this.getPermissionList.bind(this)
					}
				}
			}
		];
	}
	
	handleCSVExportClick() {
		// TODO dirty hack
		this.getDefaultBinding().set('isShowCSVExportPopup', true);
		
		this.dataLoader.doRequestWithCurrentFilterAndNoLimit().then(data => {
			this.getDefaultBinding().set('isShowCSVExportPopup', false);
			CSVExportController.getCSVByGridModel(
				CSVExportConsts.gridTypes.SUPERADMIN_STATISTIC,
				data,
				this.grid
			);
		});
	}
	
	init(){
		const schoolId = this.rootBinding.get('routing.pathParameters.0');
		this.grid = new GridModel({
			actionPanel:{
				title:      'User Statistic',
				showStrip:  true
			},
			columns:this.columns,
			uniqueField: 'userId',
			filters:{
				limit:20,
				order:'startedAt DESC',
				where: {
					schoolId: schoolId
				}
			}
		});
		
		this.dataLoader =   new DataLoader({
			serviceName:'userStats',
			grid:       this.grid,
			onLoad:     this.getDataLoadedHandle()
		});
		
		this.grid.actionPanel.btnCSVExport = this.props.btnCSVExport(() => this.handleCSVExportClick());
		return this;
	};
	
	getDataLoadedHandle(){
		const binding = this.getDefaultBinding();
		
		return data => {
			binding.set('data', this.grid.table.data);
		};
	};
}