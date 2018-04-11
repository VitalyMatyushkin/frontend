import {DataLoader} from 'module/ui/grid/data-loader';
import {GridModel} from 'module/ui/grid/grid-model';
import {AdminServiceList} from "module/core/service_list/admin_service_list";
import {STATUS_FOR_FILTER} from './form/status_helper';

interface StripeIntegration {
	id: string
	key: string
	name: string
	status: string
}

export class StripeIntegrationsModel{

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

	setColumns(): void {
		this.columns = [
			{
				text:'Name',
				isSorted:  true,
				cell:{
					dataField:'name'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Key',
				isSorted:  true,
				cell:{
					dataField:'key'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Status',
				isSorted:  true,
				cell:{
					dataField:'status'
				}
			},
			{
				text:'Status',
				hidden:true,
				cell:{
					dataField:'status'
				},
				filter:{
					type:'multi-select',
					typeOptions:{
						items: STATUS_FOR_FILTER,
						hideFilter:true
					}
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

	onEdit(stripeIntegration: StripeIntegration, eventDescriptor: any) {
		document.location.hash = `payments/stripe_integrations/edit?id=${stripeIntegration.id}`;
		eventDescriptor.stopPropagation();
	}

	onRemove(stripeIntegration: StripeIntegration, eventDescriptor: any) {
		(window as any).confirmAlert(
			`Are you sure you want to remove stripe integration ${stripeIntegration.name}?`,
			"Ok",
			"Cancel",
			() => (window.Server as AdminServiceList).paymentsStripeIntegration
				.delete(
					{
						integrationId: stripeIntegration.id
					}
				)
				.then(() => this.dataLoader.loadData()),
			() => {}
		);
		eventDescriptor.stopPropagation();
	}

	createGrid() {
		this.grid = new GridModel({
			actionPanel:{
				title:      'Stripe integrations',
				showStrip:  true,
				btnAdd:     this.props.addButton
			},
			columns:this.columns,
			filters: {limit:20}
		});

		this.dataLoader = new DataLoader({
			serviceName:'paymentsStripeIntegrations',
			grid:       this.grid,
			onLoad:     this.getDataLoadedHandle()
		});

		return this;
	}


	createGridFromExistingData(grid: GridModel) {
		this.grid = new GridModel({
			actionPanel:{
				title:      'Stripe integrations',
				showStrip:  true
			},
			columns:this.columns,
			filters: {
				where: grid.filter.where,
				order: grid.filter.order
			},
			badges: grid.filterPanel.badgeArea
		});

		this.dataLoader =   new DataLoader({
			serviceName:'paymentsStripeIntegrations',
			grid:       this.grid,
			onLoad:     this.getDataLoadedHandle()
		});

		return this;
	}

	getDataLoadedHandle() {
		const binding = this.getDefaultBinding();

		return data => {
			binding.set('data', this.grid.table.data);
		};
	};
}