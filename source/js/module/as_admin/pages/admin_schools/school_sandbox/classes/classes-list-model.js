/**
 * Created by Anatoly on 12.12.2016.
 */

const   DataLoader      = require('module/ui/grid/data-loader'),
        React           = require('react'),
        Morearty        = require('morearty'),
        GridModel       = require('module/ui/grid/grid-model');

/**
 * ClassesListModel
 *
 * @param {object} page
 *
 * */
const ClassesListModel = function(page){
    this.getDefaultBinding = page.getDefaultBinding;
    this.getMoreartyContext = page.getMoreartyContext;
    this.props = page.props;
    this.state = page.state;

    const binding = this.getDefaultBinding();

    this.setColumns();
    this.grid = new GridModel({
        actionPanel:{
            title:'Forms',
            showStrip:true,
            btnAdd:this.props.addButton
        },
        columns:this.columns,
        filters:{limit: 20}
    });

    const   globalBinding   = this.getMoreartyContext().getBinding(),
            schoolId        = globalBinding.get('routing.pathParameters.0');

    this.dataLoader =   new DataLoader({
        serviceName:    'schoolForms',
        params:         {schoolId:schoolId},
        grid:           this.grid,
        onLoad:         this.getDataLoadedHandle()
    });

};

ClassesListModel.prototype.getActions = function(){
    const actionList = ['Edit'];
    return actionList;
};

ClassesListModel.prototype.getQuickEditAction = function(itemId, action){
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

ClassesListModel.prototype.getEditFunction = function(itemId){
    const   globalBinding   = this.getMoreartyContext().getBinding(),
            schoolId        = globalBinding.get('routing.pathParameters.0'),
            formId          = itemId;

    document.location.hash = `school_sandbox/${schoolId}/forms/edit/${formId}`;
};

ClassesListModel.prototype.setColumns = function(){
    this.columns = [
        {
            text:'Name',
            isSorted:false,
            cell:{
                dataField:'name',
                type:'general'
            },
            filter:{
                type:'string'
            }
        },
        {
            text:'Age group',
            isSorted:false,
			cell:{
				dataField:'ageGroup',
				type:'general'
			},
            filter:{
                type:'string'
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

ClassesListModel.prototype.getDataLoadedHandle = function(){
    const binding = this.getDefaultBinding();

    return function(data){
        binding.set('data', this.grid.table.data);
    };
};

module.exports = ClassesListModel;
