/**
 * Created by Anatoly on 12.12.2016.
 */

const   {DataLoader}      = require('module/ui/grid/data-loader'),
        React           = require('react'),
        Morearty        = require('morearty'),
		{GridModel}     = require('module/ui/grid/grid-model');

/**
 * HousesListModel
 *
 * @param {object} page
 *
 * */
const HousesListModel = function(page){
    this.getDefaultBinding = page.getDefaultBinding;
    this.getMoreartyContext = page.getMoreartyContext;
    this.props = page.props;
    this.state = page.state;

    const binding = this.getDefaultBinding();

    this.setColumns();
    this.grid = new GridModel({
        actionPanel:{
            title:'Houses',
            showStrip:true,
            btnAdd:this.props.addButton
        },
        columns:this.columns,
        filters:{limit: 20}
    });

    const   globalBinding   = this.getMoreartyContext().getBinding(),
            schoolId        = globalBinding.get('routing.pathParameters.0');

    this.dataLoader =   new DataLoader({
        serviceName:    'schoolHouses',
        params:         {schoolId:schoolId},
        grid:           this.grid,
        onLoad:         this.getDataLoadedHandle()
    });

};

HousesListModel.prototype.getActions = function(){
    const actionList = ['Edit'];
    return actionList;
};

HousesListModel.prototype.getQuickEditAction = function(itemId, action){
    const actionKey = action;
    //For future extension, maybe will appear new actions
    switch (actionKey){
            case 'Edit':
                this.getEditFunction(itemId);
                break;
            default :
                break;
        }

};

HousesListModel.prototype.getEditFunction = function(itemId){
    const   globalBinding   = this.getMoreartyContext().getBinding(),
            schoolId        = globalBinding.get('routing.pathParameters.0'),
            houseId         = itemId;

    document.location.hash = `school_sandbox/${schoolId}/houses/edit/${houseId}`;
};

HousesListModel.prototype.setColumns = function(){
    this.columns = [
        {
            text:'House name',
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
            text:'Description',
            isSorted:false,
            cell:{
                dataField:'description',
                type:'general'
            }
        },
        {
            text:'Color',
            isSorted:false,
            cell:{
                dataField:'colors',
                type:'colors'
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

HousesListModel.prototype.getDataLoadedHandle = function(){
    const binding = this.getDefaultBinding();

    return function(data){
        binding.set('data', this.grid.table.data);
    };
};

module.exports = HousesListModel;
