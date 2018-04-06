import {DataLoader}     from 'module/ui/grid/data-loader';
import {GridModel}      from 'module/ui/grid/grid-model';
import {DateHelper} from "module/helpers/date_helper";
import {STATUS_FOR_FILTER} from '../status_helper';
import {ServiceList} from "module/core/service_list/service_list";

interface Post {
	authorId: string
	blogId: string
	content: string
	createdAt: string
	id: string
	publishedAt: string
	status: string
	threadId: string
	title: string
	updatedAt: string
}

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

	getCreatedAt(item: Post): string {
		console.log(item);
		return DateHelper.getFormatDateTimeFromISOByRegion(item.createdAt, this.props.region);
	}

	getPublishedAt(item: Post): string {
		return DateHelper.getFormatDateTimeFromISOByRegion(item.publishedAt, this.props.region);
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
				text:'Published',
				isSorted:  true,
				cell:{
					dataField:'publishedAt',
					type:'custom',
					typeOptions:{
						parseFunction: this.getPublishedAt.bind(this)
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

	onEdit(post: Post, eventDescriptor: any) {
		document.location.hash = `/blogs/${this.blogId}/posts/edit?id=${post.id}`;
		eventDescriptor.stopPropagation();
	}

	onRemove(post: Post, eventDescriptor: any) {
		(window as any).confirmAlert(
			`Are you sure you want to remove post ${post.title}?`,
			"Ok",
			"Cancel",
			() => (window.Server as ServiceList).post
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

	createGridFromExistingData(grid: GridModel){

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