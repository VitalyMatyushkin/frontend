const	React		= require('react'),
		SVG			= require('module/ui/svg'),
		DataLoader	= require('module/ui/grid/data-loader'),
		{GridModel}	= require('module/ui/grid/grid-model');

const SchoolUnionListModel = function(page, handleClickAddButton){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;

	this.setColumns();
	this.setAddButton(handleClickAddButton);

	this.grid = new GridModel({
		actionPanel	: {
			title		: 'School Unions',
			showStrip	: true,
			btnAdd		: this.btnAdd
		},
		columns		: this.columns,
		filters		: {
			limit: 20,
			where: { kind: 'SchoolUnion' }
		}
	});

	this.dataLoader = new DataLoader({
		serviceName	:'schools',
		grid		: this.grid,
		onLoad		: this.getDataLoadedHandle()
	});
};

SchoolUnionListModel.prototype.setAddButton = function(handleClickAddButton) {
	this.btnAdd = (
		<div	className			="addButton bTooltip"
				data-description	="Add School Union"
				onClick				={handleClickAddButton}
		>
			<SVG icon="icon_add_school"/>
		</div>
	);
};

SchoolUnionListModel.prototype.getActions = function(){
	return ['Edit', 'Delete'];
};

SchoolUnionListModel.prototype.getQuickEditAction = function(itemId, action){
	const actionKey = action;

	switch (actionKey){
		case 'Edit':
			this.getEditFunction(itemId);
			break;
		case 'Delete':
			this.getDeleteFunction(itemId);
			break;
		default :
			break;
	}

};

SchoolUnionListModel.prototype.getEditFunction = function(schoolId){
	document.location.hash = `schools/school_union/edit?id=${schoolId}`;
};

SchoolUnionListModel.prototype.getDeleteFunction = function(itemId){
	const binding = this.getDefaultBinding();

	window.confirmAlert(
		"Do you really want to remove this item?",
		"Ok",
		"Cancel",
		() => {
			window.Server.school.delete(itemId).then(function(){
					binding.update(function(result) {
						return result.filter(function(res) {
							return res.get('id') !== itemId;
						});
					});
					this.reloadData();
				}
			);
		},
		() => {}
	);
};

SchoolUnionListModel.prototype.reloadData = function(){
	this.dataLoader.loadData();
};

SchoolUnionListModel.prototype.getSchoolList = function(){
	return window.Server.schools.get({filter:{limit:1000}});
};

SchoolUnionListModel.prototype.getStatusList = function(){
	return [
		{
			key:'ACTIVE',
			value:'Active'
		},
		{
			key:'INACTIVE',
			value:'Inactive'
		},
		{
			key:'SUSPENDED',
			value:'Suspended'
		},
		{
			key:'EMAIL_NOTIFICATIONS',
			value:'Email Notifications'
		}
	];
};

SchoolUnionListModel.prototype.setColumns = function(){
	this.columns = [
		{
			text:'Logo',
			isSorted:false,
			cell:{
				dataField:'pic',
				type:'image'
			}
		},
		{
			text:'School',
			isSorted:true,
			cell:{
				dataField:'name',
				type:'general'
			},
			filter:{
				type:'string'
			}
		},
		{
			text:'Phone',
			isSorted:false,
			cell:{
				dataField:'phone',
				type:'general'
			}
		},
		{
			text:'Address',
			isSorted:true,
			cell:{
				dataField:'address',
				type:'general'
			},
			filter:{
				type:'string'
			}
		},
		{
			text:'Domain',
			isSorted:true,
			cell:{
				dataField:'domain',
				type:'general'
			},
			filter:{
				type:'string'
			}
		},
		{
			text:'Status',
			isSorted:true,
			cell:{
				dataField:'status',
				type:'general'
			},
			filter:{
				type:'multi-select',
				typeOptions:{
					items: this.getStatusList()
				}
			}
		},
		{
			text:'Actions',
			width:'150px',
			cell:{
				type:'action-list',
				typeOptions:{
					getActionList:this.getActions.bind(this),
					actionHandler:this.getQuickEditAction.bind(this)
				}
			}
		}
	];
};

SchoolUnionListModel.prototype.getDataLoadedHandle = function(){
	const binding = this.getDefaultBinding();

	return function(data){
		binding.set('data', this.grid.table.data);
	};
};

module.exports = SchoolUnionListModel;