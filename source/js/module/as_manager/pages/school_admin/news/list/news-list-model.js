/**
 * Created by Anatoly on 18.08.2016.
 */

const 	React 			= require('react'),
		Morearty		= require('morearty'),
		SVG 			= require('module/ui/svg'),
		DataLoader 		= require('module/ui/grid/data-loader'),
		GridModel 		= require('module/ui/grid/grid-model');

/**
 * NewsListModel
 *
 * @param {object} page
 *
 * */
const NewsListModel = function(page){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;

	this.rootBinding = this.getMoreartyContext().getBinding();
	this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');

	this.grid = this.getGrid();
	this.dataLoader = new DataLoader({
		serviceName:'schoolNews',
		params:		{schoolId:this.activeSchoolId},
		grid:		this.grid,
		onLoad: 	this.getDataLoadedHandle()
	});
};

NewsListModel.prototype = {
	reloadData:function(){
		this.dataLoader.loadData();
	},
	onEdit: function(data) {
		document.location.hash += '/edit?id=' + data.id;
	},
	onView: function(data) {
		document.location.hash += '/view?id=' + data.id;
	},
	onRemove:function(data){
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
	},
	getGrid: function(){
		const 	role 			= this.rootBinding.get('userData.authorizationInfo.role'),
				changeAllowed 	= role === "ADMIN" || role === "MANAGER";

		const columns = [
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
					type:'string'
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
					type:'between-date'
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

		return new GridModel({
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
			columns:columns,
			handleClick: this.props.handleClick
		});
	},
	getDataLoadedHandle: function(data){
		const self = this,
			binding = self.getDefaultBinding();

		return function(data){
			binding.set('data', self.grid.table.data);
		};
	}
};


module.exports = NewsListModel;
