/**
 * Created by Woland on 03.05.2017.
 */
import {DateHelper} from "../../../../helpers/date_helper";

const 	{DataLoader} 		= require('module/ui/grid/data-loader'),
		React 			= require('react'),
		Morearty 		= require('morearty'),
		{GridModel}		= require('module/ui/grid/grid-model');

/**
 * AdminUserNotifications
 *
 * @param {object} page
 *
 * */
class AdminUserNotificationsClass {
	constructor(page){
		this.getDefaultBinding = page.getDefaultBinding;
		this.getMoreartyContext = page.getMoreartyContext;
		this.props = page.props;
		this.state = page.state;
		
		const binding = this.getDefaultBinding();
		
		this.setColumns();
		this.grid = new GridModel({
			actionPanel:{
				title:'Notifications',
				showStrip:true
			},
			columns:this.columns,
            handleClick: this.handleClickNotification.bind(this),
			filters:{limit: 20, order:'createdAt DESC'}
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

    handleClickNotification(id) {
        window.location.hash = `user/notifications-view/item?id=${id}`;
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
					type:'custom',
					typeOptions:{
						parseFunction: this.getCreatedAt.bind(this)
					}
				},
				filter:{
					type:'between-date'
				}
			}
		];
	}

	getCreatedAt(item) {
		return DateHelper.getDateLongTimeString(new Date(item.createdAt));
	}

	getDataLoadedHandle(){
		const binding = this.getDefaultBinding();
		
		return function(data){
			binding.set('data', this.grid.table.data);
		};
	}
}

module.exports = AdminUserNotificationsClass;