import * as React from 'react'

import {DataLoader} from "module/ui/grid/data-loader"
import {SVG} from 'module/ui/svg'
import {GridModel} from 'module/ui/grid/grid-model'
import {ServiceList} from "module/core/service_list/service_list";

/**
 * ClubListModel
 *
 * @param {object} page
 *
 * */
export class ClubListModel {
	getDefaultBinding: any;
	getMoreartyContext: any;
	props: any;
	state: any;
	rootBinding: any;
	activeSchoolId: string;
	grid: GridModel;
	dataLoader: DataLoader;
	columns: any;

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
	};

	onEdit(data, event) {
		document.location.hash = 'clubs/editMainInfo?id=' + data.id;
		event.stopPropagation();
	};

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
				`Are you sure you want to remove club ${data.name}?`,
				"Ok",
				"Cancel",
				() => {
					(window.Server as ServiceList).schoolClub
						.delete( {schoolId:self.activeSchoolId, clubId:data.id} )
						.then(() => self.reloadData())
						.catch(() => showAlert())},
				() => {}
			);
		}
		event.stopPropagation();
	};

	getColumns() {
		this.columns = [
			{
				text:		'Name',
				isSorted:	true,
				cell:		{ dataField:'name' },
				filter:		{
					id:		'club_name_filter',
					type:	'string'
				}
			},
			{
				text:		'Description',
				isSorted:	false,
				cell:		{ dataField:'description' },
				filter:		{
					id:		'club_description_filter',
					type:	'string'
				}
			},
			{
				text:		'Status',
				isSorted:	true,
				cell:		{ dataField:'status' },
				filter:		{
					id:		'club_status_filter',
					type:	'string'
				}
			},
			{
				text:	'Actions',
				cell:	{
					type:			'action-buttons',
					typeOptions:	{
						onItemEdit:		this.onEdit.bind(this),
						onItemRemove:	this.onRemove.bind(this)
					}
				}
			}
		];
	};

	createGrid() {
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
			columns: this.columns,
			handleClick: this.props.handleClick,
			filters: {
				limit: 100,
				where: {
					status:  {$in: ['DRAFT', 'ACTIVE']}
				}
			}
		});

		this.dataLoader = new DataLoader({
			serviceName:'schoolClubs',
			params:		{schoolId:this.activeSchoolId},
			grid:		this.grid,
			onLoad: 	this.getDataLoadedHandle() // TODO You can use arrow function right here instead 'getDataLoadedHandle'.
		});

		return this;
	};

	createGridFromExistingData(grid) {
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
	getDataLoadedHandle = function(){
		const binding = this.getDefaultBinding();

		return function(){
			binding.set('data', this.grid.table.data);
		};
	};
}