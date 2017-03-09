const	React			= require('react'),
		Morearty		= require('morearty'),
		SVG				= require('module/ui/svg'),
		DataLoader		= require('module/ui/grid/data-loader'),
		GridModel		= require('module/ui/grid/grid-model');

const PlaceListModel = function(page){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;
	this.rootBinding = this.getMoreartyContext().getBinding();
	this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');

	const binding = this.getDefaultBinding();
	this.getPlaces(this.activeSchoolId).then(places => binding.set('places', places));

	this.grid = this.getGrid();
	this.dataLoader = new DataLoader({
		serviceName: 'schoolPlaces',
		params: { schoolId: this.activeSchoolId },
		grid: this.grid,
		onLoad: this.onLoadData.bind(this)
	});
};

PlaceListModel.prototype = {
	reloadData:function(){
		this.dataLoader.loadData();
	},
	onEdit: function(place, eventDescriptor) {
		document.location.hash += `/edit?id=${place.id}`;
		eventDescriptor.stopPropagation();
	},
	onRemove: function(place, eventDescriptor) {
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
	},
	getPlaces:function (schoolId) {
		return window.Server.schoolPlaces.get(schoolId, {filter:{limit:1000}});
	},
	getGrid: function(){
		const columns = [
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

		return new GridModel({
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
			columns: columns,
			handleClick: this.props.handleClick,
			filters: {
				limit: 100,
				where: {
					removed: false
				}
			}
		});
	},
	onLoadData: function(){
		this.getDefaultBinding().set('data', this.grid.table.data);
	}
};


module.exports = PlaceListModel;
