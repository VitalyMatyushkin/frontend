/**
 * Created by Anatoly on 18.08.2016.
 */

const 	React 			= require('react'),
		Morearty		= require('morearty'),
		SessionHelper	= require('module/helpers/session_helper'),
		SVG 			= require('module/ui/svg'),
		DataLoader 		= require('module/ui/grid/data-loader'),
		{GridModel}		= require('module/ui/grid/grid-model');

/**
 * NewsListClass
 *
 * @param {object} page
 *
 * */
class NewsListModel {
	constructor(page) {
		this.getDefaultBinding = page.getDefaultBinding;
		this.getMoreartyContext = page.getMoreartyContext;
		this.props = page.props;
		this.state = page.state;
		
		this.rootBinding = this.getMoreartyContext().getBinding();
		this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');
		
		this.getColumns();
	}
	
	reloadData() {
		this.dataLoader.loadData();
	}
	
	onEdit(data, event) {
		document.location.hash += '/edit?id=' + data.id;
		event.stopPropagation();
	}
	
	onView(data, event) {
		document.location.hash += '/view?id=' + data.id;
		event.stopPropagation();
	}
	
	onRemove(data, event) {
		const 	self = this;
		
		if(typeof data !== 'undefined') {
			const showAlert = function() {
				window.simpleAlert(
					'Sorry! You cannot perform this action. Please contact support',
					'Ok',
					() => {
					}
				);
			};
			
			window.confirmAlert(
				`Are you sure you want to remove news "${data.title}"?`,
				"Ok",
				"Cancel",
				() => {window.Server.schoolNewsItem
				.delete( {schoolId:self.activeSchoolId, newsId:data.id} )
				.then(() => self.reloadData())
				.catch(() => showAlert())},
				() => {}
			);
		}
		event.stopPropagation();
	}
	
	getColumns() {
		const 	role 			= SessionHelper.getRoleFromSession(this.rootBinding.sub('userData')),
				changeAllowed 	= role === "ADMIN" || role === "MANAGER";
		
		this.columns = [
			{
				text:'Thumbnail',
				cell:{
					dataField:'picUrl',
					type:'image'
				}
			},
			{
				text:'Title',
				isSorted:true,
				cell:{
					dataField:'title'
				},
				filter:{
					type:'string',
					id:'find_news_title'
				}
			},
			{
				text:'Date',
				isSorted:true,
				cell:{
					dataField:'date',
					type:'date'
				},
				filter:{
					type:'between-date',
                    id:'find_news_date'
				}
			},
			{
				text:'Actions',
				cell:{
					type:'action-buttons',
					typeOptions:{
						/**
						 * Only school admin and manager can edit news.
						 * All other users should not see that button.
						 * */
						onItemEdit:		changeAllowed ? this.onEdit.bind(this) : null,
						onItemView:		this.onView.bind(this),
						onItemRemove:	changeAllowed ? this.onRemove.bind(this) : null
					}
				}
			}
		];
	}
	
	createGrid() {
		const 	role 			= SessionHelper.getRoleFromSession(this.rootBinding.sub('userData')),
			changeAllowed 	= role === "ADMIN" || role === "MANAGER";
		
		this.grid = new GridModel({
			actionPanel:{
				title:'News',
				showStrip:true,
				
				/**Only school admin and manager can add new news. All other users should not see that button.*/
				btnAdd:changeAllowed ?
					(
						<div className="addButtonShort bTooltip" data-description="Add News"
							 onClick={function(){document.location.hash += '/add';}}>
							<SVG icon="icon_add_news" />
						</div>
					) : null
			},
			columns:this.columns,
			handleClick: this.props.handleClick
		});
		
		this.dataLoader = new DataLoader({
			serviceName:'schoolNews',
			params:		{schoolId:this.activeSchoolId},
			grid:		this.grid,
			onLoad: 	this.getDataLoadedHandle()
		});
		
		return this;
	}
	
	createGridFromExistingData(grid) {
		const 	role 			= SessionHelper.getRoleFromSession(this.rootBinding.sub('userData')),
				changeAllowed 	= role === "ADMIN" || role === "MANAGER";
		
		this.grid = new GridModel({
			actionPanel:{
				title:'News',
				showStrip:true,
				
				/**Only school admin and manager can add new news. All other users should not see that button.*/
				btnAdd:changeAllowed ?
					(
						<div className="addButtonShort bTooltip" data-description="Add News"
							 onClick={function(){document.location.hash += '/add';}}>
							<SVG icon="icon_add_news" />
						</div>
					) : null
			},
			columns:this.columns,
			handleClick: this.props.handleClick,
			filters: {
				where: grid.filter.where,
				order: grid.filter.order
			},
			badges: grid.filterPanel.badgeArea
		});
		
		this.dataLoader = new DataLoader({
			serviceName:'schoolNews',
			params:		{schoolId:this.activeSchoolId},
			grid:		this.grid,
			onLoad: 	this.getDataLoadedHandle()
		});
		
		return this;
	}
	
	getDataLoadedHandle(data) {
		const self = this,
			binding = self.getDefaultBinding();
		
		return function(data){
			binding.set('data', self.grid.table.data);
		};
	}
	
};

module.exports = NewsListModel;
