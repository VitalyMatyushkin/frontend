const 	React 			= require('react'),
		SessionHelper	= require('module/helpers/session_helper'),
		DataLoader 		= require('module/ui/grid/data-loader'),
		SVG				= require('module/ui/svg'),
		GridModel 		= require('module/ui/grid/grid-model');

/**
 * ClubListModel
 *
 * @param {object} page
 *
 * */
const ClubListModel = function(page){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;

	this.rootBinding = this.getMoreartyContext().getBinding();
	this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');

	this.grid = this.getColumns();
};

ClubListModel.prototype.reloadData = function(){
	this.dataLoader.loadData();
};

ClubListModel.prototype.onEdit = function(data, event) {
	document.location.hash = 'clubs/edit?id=' + data.id;
	event.stopPropagation();
};

ClubListModel.prototype.onRemove = function(data, event){
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
			`Are you sure you want to remove club ${data.name}?`,
			"Ok",
			"Cancel",
			() => {
				window.Server.schoolClub
					.delete( {schoolId:self.activeSchoolId, clubId:data.id} )
					.then(() => self.reloadData())
					.catch(() => showAlert())},
			() => {}
		);
	}
	event.stopPropagation();
};

ClubListModel.prototype.getColumns = function(){
	this.columns = [
		{
			text:'Name',
			isSorted:true,
			cell: {
				dataField:'name'
			},
			filter:{
				type:'string',
				id:'find_house_name'
			}
		},
		{
			text:'Description',
			isSorted:true,
			cell:{
				dataField:'description'
			},
			filter:{
				type:'string',
				id:'find_house_description'
			}
		},
		{
			text:'Actions',
			cell:{
				type:'action-buttons',
				typeOptions:{
					onItemEdit:		this.onEdit.bind(this),
					onItemRemove:	this.onRemove.bind(this)
				}
			}
		}
	];
};

ClubListModel.prototype.createGrid = function(){
	this.grid = new GridModel({
		actionPanel:{
			title:'Clubs',
			showStrip:true,

			btnAdd: (
					<div
						className			= "addButtonShort bTooltip"
						data-description	= "Add Club"
						onClick				= { () => document.location.hash = 'clubs/add' }
					>
						<SVG icon="icon_add_house" />
					</div>
				)
		},
		columns:this.columns,
		handleClick: this.props.handleClick
	});

	this.dataLoader = new DataLoader({
		serviceName:'schoolClubs',
		params:		{schoolId:this.activeSchoolId},
		grid:		this.grid,
		onLoad: 	this.getDataLoadedHandle() // TODO You can use arrow function right here instead 'getDataLoadedHandle'.
	});

	return this;
};

ClubListModel.prototype.createGridFromExistingData = function(grid){
	this.grid = new GridModel({
		actionPanel:{
			title:'Clubs',
			showStrip:true,

			btnAdd: (
				<div
					className			= "addButtonShort bTooltip"
					data-description	= "Add Club"
					onClick				= { () => document.location.hash = 'clubs/add' }
				>
					<SVG icon="icon_add_house" />
				</div>
			)
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
		serviceName:'schoolClubs',
		params:		{schoolId:this.activeSchoolId},
		grid:		this.grid,
		onLoad: 	this.getDataLoadedHandle()
	});

	return this;
};

// TODO Get WHAT??
ClubListModel.prototype.getDataLoadedHandle = function(data){
	const self = this,
		binding = self.getDefaultBinding();

	return function(data){
		binding.set('data', self.grid.table.data);
	};
};

module.exports = ClubListModel;