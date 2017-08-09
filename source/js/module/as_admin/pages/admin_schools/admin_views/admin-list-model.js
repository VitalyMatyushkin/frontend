/**
 * Created by Anatoly on 12.12.2016.
 */

const   DataLoader      = require('module/ui/grid/data-loader'),
        React           = require('react'),
        Morearty        = require('morearty'),
        GridModel       = require('module/ui/grid/grid-model');

/**
 * SchoolsListModel
 *
 * @param {object} page
 *
 * */
const SchoolsListModel = function(page){
    this.getDefaultBinding = page.getDefaultBinding;
    this.getMoreartyContext = page.getMoreartyContext;
    this.props = page.props;
    this.state = page.state;

    const binding = this.getDefaultBinding();

    this.setColumns();
    this.grid = new GridModel({
        actionPanel:{
            title:'Schools',
            showStrip:true,
            btnAdd:this.props.addButton
        },
        columns:this.columns,
		handleClick: this.props.handleClick,
        filters:{limit: 20}
    });

    const   globalBinding   = this.getMoreartyContext().getBinding();

    this.dataLoader =   new DataLoader({
        serviceName:    'schools',
        grid:           this.grid,
        onLoad:         this.getDataLoadedHandle()
    });

};

SchoolsListModel.prototype.getActions = function(){
    const actionList = ['Edit', 'View', 'Delete'];
    return actionList;
};

SchoolsListModel.prototype.getQuickEditAction = function(itemId, action){
    const actionKey = action;
    //For future extension, maybe will appear new actions
    switch (actionKey){
            case 'Edit':
                this.getEditFunction(itemId);
                break;
            case 'View':
                this.getViewFunction(itemId);
                break;
            case 'Delete':
                this.getDeleteFunction(itemId);
                break;
            default :
                break;
        }

};

SchoolsListModel.prototype.getEditFunction = function(itemId){
    document.location.hash = 'schools/admin_views/edit?id=' + itemId;
};

SchoolsListModel.prototype.getViewFunction = function(itemId){
    document.location.hash = `school_sandbox/${itemId}/forms`;
};

SchoolsListModel.prototype.getDeleteFunction = function(itemId){
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

SchoolsListModel.prototype.reloadData = function(){
    this.dataLoader.loadData();
};

SchoolsListModel.prototype.getSchoolList = function(){
    return window.Server.schools.get({filter:{limit:1000}});
};

SchoolsListModel.prototype.getStatusList = function(){
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

SchoolsListModel.prototype.setColumns = function(){
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

SchoolsListModel.prototype.getDataLoadedHandle = function(){
    const binding = this.getDefaultBinding();

    return function(data){
        binding.set('data', this.grid.table.data);
    };
};

module.exports = SchoolsListModel;
