/**
 * Created by Woland on 03.05.2017.
 */
const 	DataLoader 		= require('module/ui/grid/data-loader'),
		React 			= require('react'),
		Morearty 		= require('morearty'),
		GridModel 		= require('module/ui/grid/grid-model'),
		SVG				= require('module/ui/svg');

/**
 * AdminUserNotificationChannelClass
 *
 * @param {object} page
 *
 * */
class AdminUserNotificationChannelClass {
	constructor(page){
		this.getDefaultBinding = page.getDefaultBinding;
		this.getMoreartyContext = page.getMoreartyContext;
		this.props = page.props;
		this.state = page.state;
		
		const binding = this.getDefaultBinding();
		
		this.setColumns();
		this.grid = new GridModel({
			actionPanel:{
				title:'Notification Channel',
				showStrip:true,
				btnAdd:
					(
						<div className="addButton bTooltip" data-description="Add Notification Channel" onClick={() => {this.onClick()}}>
							<SVG icon="icon_cog" />
						</div>
					)
			},
			columns:this.columns,
			filters:{limit: 20}
		});
		
		const 	globalBinding 	= this.getMoreartyContext().getBinding(),
				userId 			= this.props.userId;
		
		this.dataLoader = 	new DataLoader({
			serviceName: 	'userNotificationChannels',
			params: 		{userId: userId},
			grid: 			this.grid,
			onLoad: 		this.getDataLoadedHandle()
		});
	}
	onClick(){
		const binding = this.getDefaultBinding();

		binding.set('isPopupOpen', true);
	}
	getActions(){
		return ['Message', 'Remove'];
	}
	getQuickEditActionsFactory(itemId, action) {
		const userId = this.props.userId;
		const binding = this.getDefaultBinding();
		
		switch (action) {
			case 'Remove':
				window.Server.userNotificationChannel.delete({userId: userId, channelId: itemId}).then(
					() => this.reloadData()
				);
			break;
			case 'Message':
				binding.atomically()
				.set('isPopupSendMessageFormOpen', true)
				.set('channelId', itemId)
				.commit();
				break;
			default :
				break;
		}
	}
	reloadData(){
		this.dataLoader.loadData();
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
			},
			{
				text:'Actions',
				cell:{
					type:'action-list',
					typeOptions:{
						getActionList:this.getActions.bind(this),
						actionHandler:this.getQuickEditActionsFactory.bind(this)
					}
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

module.exports = AdminUserNotificationChannelClass;