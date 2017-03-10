const	React			= require('react'),
		Sport			= require('module/ui/icons/sport_icon'),
		DataLoader		= require('module/ui/grid/data-loader'),
		GridModel		= require('module/ui/grid/grid-model');

const SportListModel = function(page, schoolId, onReload){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;
	this.schoolId = schoolId;

	this.setColumns();
	this.grid = new GridModel({
		actionPanel: {
			title: 'Sports',
			showStrip: true
		},
		columns: this.columns,
		filters: {limit: 20}
	});

	this.dataLoader = new DataLoader({
		serviceName: 'schoolSports',
		params: {schoolId: schoolId},
		grid: this.grid,
		onLoad: this.getDataLoadedHandle()
	});

	this.onReload = onReload;
};

SportListModel.prototype.getActions = function(){
	const actionList = ['Add to favourites', 'Remove from favourites'];
	return actionList;
};

SportListModel.prototype.getQuickEditAction = function(itemId, action){
	const actionKey = action;
	//For future extension, maybe will appear new actions
	switch (actionKey){
		case 'Add to favourites':
			this.getSelectAsFavoriteFunction(itemId);
			break;
		case 'Remove from favourites':
			this.getUnselectAsFavoriteFunction(itemId);
			break;
		default :
			break;
		}

};

SportListModel.prototype.getSelectAsFavoriteFunction = function(itemId){
	const sportId = itemId;

	window.Server.schoolSport.put({
		schoolId: this.schoolId,
		sportId: sportId
	}, {
		isFavorite: true
	}).then(() => this.onReload());
};

SportListModel.prototype.getUnselectAsFavoriteFunction = function(itemId){
	const sportId = itemId;

	window.Server.schoolSport.put({
		schoolId: this.schoolId,
		sportId: sportId
	}, {
		isFavorite: false
	}).then(() => this.onReload());
};

SportListModel.prototype.setColumns = function(){
	this.columns = [
		{
			cell: {
				type: 'custom',
				typeOptions: {
					parseFunction: item => <Sport name={item.name} className='bIcon_invites ' />
				}
			}
		},
		{
			text: 'Name',
			isSorted: true,
			cell: {
				dataField:'name'
			},
			filter: {
				type:'string'
			}
		},
		{
			text: 'Favorite',
			isSorted: true,
			cell:{
				dataField: 'isFavorite',
				type: 'custom',
				typeOptions: {
					parseFunction: this.getFavoriteTeamContentForItem.bind(this)
				}
			},
			filter: {
				type: 'string'
			}
		},
		{
			text: 'Description',
			isSorted: true,
			cell: {
				dataField: 'description'
			},
			filter: {
				type: 'string'
			}
		},
		{
			text: 'Actions',
			cell: {
				type: 'action-list',
				typeOptions: {
					getActionList: this.getActions.bind(this),
					actionHandler: this.getQuickEditAction.bind(this)
				}
			}
		}
	];
};

SportListModel.prototype.getFavoriteTeamContentForItem = function(item) {
	if (item.isFavorite) {
		return (
			<span className="eStar">
				<i className = "fa fa-star fa-lg" aria-hidden="true"></i>
			</span>
		);
	} else {
		return null;
	}
};

SportListModel.prototype.getDataLoadedHandle = function(){
	const binding = this.getDefaultBinding();

	return (data) => {
		binding.set('data', this.grid.table.data);
	};
};

module.exports = SportListModel;