import {DataLoader} from 'module/ui/grid/data-loader';
import {GridModel} from 'module/ui/grid/grid-model';
import {ServiceList} from "module/core/service_list/service_list";
import {STATUS_FOR_FILTER} from 'module/as_admin/pages/admin_schools/school_sandbox/payments_accounts/form/status_helper';
import {PaymentAccount } from 'module/as_admin/pages/admin_schools/school_sandbox/payments_accounts/payments_accounts_list_model';

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
		this.schoolId = this.props.schoolId;
		
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
				text:'Details',
				isSorted:  false,
				cell:{
					dataField:'details',
					type:'custom',
					typeOptions:{
						parseFunction: this.getDetails.bind(this)
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

	getDetails(account: PaymentAccount) {
		if (account.stripeData.tosAcceptance.date === null &&
			account.stripeData.tosAcceptance.ip === null &&
			account.stripeData.tosAcceptance.userAgent === null) {
			return 'TOS acceptance required';
		} else {
			return '';
		}
	}

	onEdit(account: PaymentAccount, eventDescriptor: any) {
		document.location.hash = `/school_console/accounts/edit?id=${account.id}`;
		eventDescriptor.stopPropagation();
	}

	onRemove(account: PaymentAccount, eventDescriptor: any) {
		(window as any).confirmAlert(
			`Are you sure you want to remove account ${account.name}?`,
			'Ok',
			'Cancel',
			() => (window.Server as ServiceList).paymentsAccount
				.delete(
					{
						schoolId: this.schoolId,
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