import * as React from 'react'
import {SVG} from 'module/ui/svg'
import {DataLoader}	from 'module/ui/grid/data-loader'
import {GridModel} from 'module/ui/grid/grid-model'
import {ServiceList} from "module/core/service_list/service_list";

export class PlaceListClass {
	getDefaultBinding: any;
	getMoreartyContext: any;
	props: any;
	state: any;
	rootBinding: any;
	activeSchoolId: string;
	dataLoader: DataLoader;
	columns: any;
	grid: GridModel;

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
	
	reloadData() {
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
			() => (window.Server as ServiceList).schoolPlace
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
		return (window.Server as ServiceList).schoolPlaces.get(schoolId, {filter:{limit:1000}});
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
	
	createGrid() {
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
	
	onLoadData() {
		this.getDefaultBinding().set('data', this.grid.table.data);
	}
}