import {DataLoader}     from 'module/ui/grid/data-loader';
import {GridModel}      from 'module/ui/grid/grid-model';
import {DateHelper} from "module/helpers/date_helper";

export class BlogsModel{

	getDefaultBinding: any;
	getMoreartyContext: any;
	props: any;
	state: any;
	rootBinding: any;
	activeSchoolId: string;
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

	getCreatedAt(item: any): string {
		return DateHelper.getFormatDateTimeFromISOByRegion(item.createdAt, this.props.region);
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
				text:'Created',
				isSorted:  true,
				cell:{
					dataField:'createdAt',
					type:'custom',
					typeOptions:{
						parseFunction: this.getCreatedAt.bind(this)
					}
				},
				filter:{
					type:'between-date-time'
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

	onEdit(blog, eventDescriptor: any) {
		document.location.hash = `blogs/edit?id=${blog.id}`;
		eventDescriptor.stopPropagation();
	}

	onRemove(blog, eventDescriptor: any) {
		(<any>window).confirmAlert(
			`Are you sure you want to remove blog ${blog.name}?`,
			"Ok",
			"Cancel",
			() => (<any>window).Server.blog
				.delete(
				{
						blogId: blog.id
					}
				)
				.then(() => this.dataLoader.loadData()),
				() => {}
		);
		eventDescriptor.stopPropagation();
	}

	createGrid(){
		this.grid = new GridModel({
			actionPanel:{
				title:      'Blogs',
				showStrip:  true,
				btnAdd:     this.props.addButton
			},
			columns: this.columns,
			handleClick: this.props.handleClick,
			filters: {limit:20}
		});

		this.dataLoader =   new DataLoader({
			serviceName:'blogs',
			grid:       this.grid,
			onLoad:     this.getDataLoadedHandle()
		});

		return this;
	};

	createGridFromExistingData(grid: any){

		this.grid = new GridModel({
			actionPanel:{
				title:      'Blogs',
				showStrip:  true,
				btnAdd:     this.props.addButton
			},
			columns: this.columns,
			handleClick: this.props.handleClick,
			filters: {
				where: grid.filter.where,
				order: grid.filter.order
			},
			badges: grid.filterPanel.badgeArea
		});

		this.dataLoader =   new DataLoader({
		serviceName:'blogs',
		grid:       this.grid,
		onLoad:     this.getDataLoadedHandle()
		});

		return this;
	};

	getDataLoadedHandle(){
		const binding = this.getDefaultBinding();

		return data => {
			binding.set('data', this.grid.table.data);
		};
	};
}