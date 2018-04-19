import {DataLoader} from 'module/ui/grid/data-loader';
import {GridModel} from 'module/ui/grid/grid-model';
import {AdminServiceList} from "module/core/service_list/admin_service_list";
import {STATUS_FOR_FILTER} from './form/status_helper';

export interface PaymentAccount {
	id: string
	integrationId: string
	name: string
	status: string
	stripeData: {
		businessName: string
		country: string
		email: string
	}
	externalAccount: {
		accountHolderName: string
		accountHolderType: string
		accountNumber: string
		country: string
		currency: string
		routingNumber: string
	}
	legalEntity: {
		dob: {
			day: number
			month: number
			year: number
		}
		firstName: string
		lastName: string
		type: string
	}
	tosAcceptance: {
		date: string
		ip: string
		userAgent: string
	}
}

export class PaymentAccountModel{
	getDefaultBinding: any;
	getMoreartyContext: any;
	props: any;
	state: any;
	rootBinding: any;
	columns: any[];
	grid: GridModel;
	dataLoader: DataLoader;
	schoolId: string;

	constructor(page: any){
		this.getDefaultBinding = page.getDefaultBinding;
		this.getMoreartyContext = page.getMoreartyContext;
		this.props = page.props;
		this.state = page.state;

		this.rootBinding = this.getMoreartyContext().getBinding();

		this.schoolId = this.rootBinding.get('routing.pathParameters.0');

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

	onEdit(account: PaymentAccount, eventDescriptor: any) {
		document.location.hash = `/school_sandbox/${this.schoolId}/accounts/edit?id=${account.id}`;
		eventDescriptor.stopPropagation();
	}

	onRemove(account: PaymentAccount, eventDescriptor: any) {
		(window as any).confirmAlert(
			`Are you sure you want to remove account ${account.name}?`,
			"Ok",
			"Cancel",
			() => (window.Server as AdminServiceList).paymentsAccount
				.delete(
					{
						schoolId:	this.schoolId,
						accountId: 	account.id
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
				title:      'Payment accounts',
				showStrip:  true,
				btnAdd:     this.props.addButton
			},
			columns:this.columns,
			filters: {limit:20}
		});

		this.dataLoader = new DataLoader({
			serviceName:'paymentsAccounts',
			params: 	{schoolId: this.schoolId},
			grid:       this.grid,
			onLoad:     this.getDataLoadedHandle()
		});

		return this;
	}


	createGridFromExistingData(grid: GridModel) {
		this.grid = new GridModel({
			actionPanel:{
				title:      'Payment accounts',
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
			serviceName:'paymentsAccounts',
			params: 	{schoolId: this.schoolId},
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