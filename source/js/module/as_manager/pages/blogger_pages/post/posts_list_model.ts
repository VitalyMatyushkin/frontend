import {DataLoader}     from 'module/ui/grid/data-loader';
import {GridModel}      from 'module/ui/grid/grid-model';

export class PostsModel{

	getDefaultBinding: any;
	getMoreartyContext: any;
	props: any;
	state: any;
	rootBinding: any;
	activeSchoolId: string;
	columns: any[];
	grid: GridModel;
	dataLoader: DataLoader;
	blogId: string;

	constructor(page: any){
		this.getDefaultBinding = page.getDefaultBinding;
		this.getMoreartyContext = page.getMoreartyContext;
		this.props = page.props;
		this.state = page.state;

		this.rootBinding = this.getMoreartyContext().getBinding();
		this.blogId = this.rootBinding.get('routing.pathParameters.0');
		this.setColumns();
	}

	setColumns(): void {
		this.columns = [
			{
				text:'Title',
				isSorted:  true,
				cell:{
					dataField:'title'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Published',
				isSorted:  true,
				cell:{
					dataField:'publishedAt'
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

	onEdit(post, eventDescriptor: any) {
		document.location.hash += `/edit?id=${post.id}`;
		eventDescriptor.stopPropagation();
	}

	onRemove(post, eventDescriptor: any) {
		(<any>window).confirmAlert(
			`Are you sure you want to remove post ${post.title}?`,
			"Ok",
			"Cancel",
			() => (<any>window).Server.post
				.delete(
					{
						blogId: this.blogId,
						postId: post.id
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
				title:      'Posts',
				showStrip:  true,
				btnAdd:     this.props.addButton
			},
			columns: this.columns,
			handleClick: this.props.handleClick,
			filters: {limit:20}
		});

		this.dataLoader =   new DataLoader({
			serviceName:'posts',
			params:     {blogId: this.blogId},
			grid:       this.grid,
			onLoad:     this.getDataLoadedHandle()
		});

		return this;
	};

	createGridFromExistingData(grid: any){

		this.grid = new GridModel({
			actionPanel:{
				title:      'Posts',
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
			serviceName:'posts',
			params:     {blogId: this.blogId},
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