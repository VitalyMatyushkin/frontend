/**
 * Created by Woland on 03.05.2017.
 */
const 	DataLoader 		= require('module/ui/grid/data-loader'),
		React 			= require('react'),
		Morearty 		= require('morearty'),
		GridModel 		= require('module/ui/grid/grid-model');

/**
 * AdminUserNotificationModel
 *
 * @param {object} page
 *
 * */
class AdminUserNotificationModel {
	constructor(page){
		this.getDefaultBinding = page.getDefaultBinding;
		this.getMoreartyContext = page.getMoreartyContext;
		this.props = page.props;
		this.state = page.state;
		
		const binding = this.getDefaultBinding();
		
		this.setColumns();
		this.grid = new GridModel({
			actionPanel:{
				title:'Notification',
				showStrip:true
			},
			columns:this.columns,
			filters:{limit: 20}
		});
		
		const 	globalBinding 	= this.getMoreartyContext().getBinding(),
				userId 			= this.props.userId;
		
		this.dataLoader = 	new DataLoader({
			serviceName: 	'notifications',
			params: 		{userId: userId},
			grid: 			this.grid,
			onLoad: 		this.getDataLoadedHandle()
		});
	}
	
	setColumns(){
		this.columns = [
			{
				text:'App id',
				cell:{
					dataField:'appId',
					type: 'general'
				}
			},
			{
				text:'Device name',
				cell:{
					dataField:'deviceName',
					type: 'general'
				}
			},
			{
				text:'Environment',
				cell:{
					dataField:'environment',
					type: 'general'
				}
			},
			{
				text:'Type',
				cell:{
					dataField:'type',
					type: 'general'
				}
			}
		];
	}
	
	getDataLoadedHandle(){
		const binding = this.getDefaultBinding();
		
		return function(data){
			binding.set('data', this.grid.table.data);
		};
	}
}

module.exports = AdminUserNotificationModel;