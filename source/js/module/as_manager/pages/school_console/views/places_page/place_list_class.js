const	React			= require('react'),
		Morearty		= require('morearty'),
		SVG				= require('module/ui/svg'),
		{DataLoader}		= require('module/ui/grid/data-loader'),
		{GridModel}		= require('module/ui/grid/grid-model');

class PlaceListModel {
	constructor(page){
		this.getDefaultBinding = page.getDefaultBinding;
		this.getMoreartyContext = page.getMoreartyContext;
		this.props = page.props;
		this.state = page.state;
		this.rootBinding = this.getMoreartyContext().getBinding();
		this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');
		
		const binding = this.getDefaultBinding();
		this.getPlaces(this.activeSchoolId).then(places => binding.set('places', places));
		
		this.getColumns();
	}
	
	reloadData(){
		this.dataLoader.loadData();
	}
	
	onEdit(place, eventDescriptor) {
		document.location.hash += `/edit?id=${place.id}`;
		eventDescriptor.stopPropagation();
	}
	
	onRemove(place, eventDescriptor) {
		const self = this;
		
		window.confirmAlert(
			`Are you sure you want to remove place ${place.name}?`,
			"Ok",
			"Cancel",
			() => window.Server.schoolPlace
			.delete(
				{
					schoolId: self.activeSchoolId,
					placeId: place.id
				}
			)
			.then(() => self.reloadData()),
			() => {}
		);
		eventDescriptor.stopPropagation();
	}
	getPlaces(schoolId) {
		return window.Server.schoolPlaces.get(schoolId, {filter:{limit:1000}});
	}
	
	getColumns() {
		this.columns = [
			{
				text: 'Name',
				isSorted: true,
				cell: {
					dataField: 'name'
				},
				filter: {
					type: 'string'
				}
			},
			{
				text: 'Postcode',
				isSorted: true,
				cell: {
					dataField: 'postcode'
				},
				filter: {
					type: 'string'
				}
			},
			{
				text: 'Actions',
				cell: {
					type: 'action-buttons',
					typeOptions: {
						onItemEdit: this.onEdit.bind(this),
						onItemRemove: this.onRemove.bind(this)
					}
				}
			}
		];
	}
	
	createGrid(){
		this.grid = new GridModel({
			actionPanel: {
				title: 'Venues',
				showStrip: true,
				btnAdd: (
					<div
						className			= "addButtonShort bTooltip"
						data-description	= "Add venue"
						onClick				= {() => document.location.hash += '/add'}
					>
						<SVG icon="icon_add_team" />
					</div>
				)
			},
			columns: this.columns,
			handleClick: this.props.handleClick,
			filters: {
				limit: 10
			}
		});
		
		this.dataLoader = new DataLoader({
			serviceName: 'schoolPlaces',
			params: { schoolId: this.activeSchoolId },
			grid: this.grid,
			onLoad: this.onLoadData.bind(this)
		});
		
		return this;
	}
	
	createGridFromExistingData(grid) {
		this.grid = new GridModel({
			actionPanel: {
				title: 'Venues',
				showStrip: true,
				btnAdd: (
					<div
						className			= "addButtonShort bTooltip"
						data-description	= "Add venue"
						onClick				= {() => document.location.hash += '/add'}
					>
						<SVG icon="icon_add_team" />
					</div>
				)
			},
			columns: this.columns,
			handleClick: this.props.handleClick,
			filters: {
				where: grid.filter.where,
				order: grid.filter.order
			},
			badges: grid.filterPanel.badgeArea
		});
		
		this.dataLoader = new DataLoader({
			serviceName: 'schoolPlaces',
			params: { schoolId: this.activeSchoolId },
			grid: this.grid,
			onLoad: this.onLoadData.bind(this)
		});
		
		return this;
	}
	
	onLoadData(){
		this.getDefaultBinding().set('data', this.grid.table.data);
	}
	
}

module.exports = PlaceListModel;
