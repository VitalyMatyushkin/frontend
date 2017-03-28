// @flow
/**
 * Created by Anatoly on 21.11.2016.
 */

const 	DataLoader 		= require('module/ui/grid/data-loader'),
        React 			= require('react'),
        Morearty		= require('morearty'),
        GridModel 		= require('module/ui/grid/grid-model'),
        DateHelper      = require('module/helpers/date_helper'),
        RoleHelper 		= require('module/helpers/role_helper'),
        Timezone		= require('moment-timezone');

/**
 * UserActivityModel
 *
 * @param {object} page
 *
 * */
const UserActivityModel = function(page: any){
    this.getDefaultBinding = page.getDefaultBinding;
    this.getMoreartyContext = page.getMoreartyContext;
    this.props = page.props;
    this.state = page.state;

    this.rootBinding = this.getMoreartyContext().getBinding();

    this.setColumns();
};

UserActivityModel.prototype.getUserName = function(item): string {
    let name = '';

    if (typeof item.user !== 'undefined'){
        name = item.user.firstName + ' ' + item.user.lastName;
    }

    return name;
};

UserActivityModel.prototype.getDateTime = function(item): string {
	return Timezone.tz(item.finishedAt, window.timezone).format('HH:mm:ss DD.MM');
 };

UserActivityModel.prototype.getMethodList = function(){
    return [
        {
            key:'GET',
            value:'GET'
        },
        {
            key:'PUT',
            value:'PUT'
        },
        {
            key:'DELETE',
            value:'DELETE'
        },
        {
            key:'POST',
            value:'POST'
        }
    ];
};

UserActivityModel.prototype.setColumns = function(){
    this.columns = [
        {
            text:'',
            isSorted:false,
            cell:{
                dataField:'user.avatar',
                type:'image'
            }
        },
        {
            text:'Name',
            isSorted:false,
            cell:{
                type:'custom',
                typeOptions:{
                    parseFunction:this.getUserName.bind(this) // If without .bind did it, then return UserActivityModel
                }
            }
        },
        {
            text:'IP adress',
            isSorted:false,
            cell:{
                dataField:'httpHeaders.x-real-ip',
                type:'general'
            },
            filter:{
                type:'string'
            }
        },
        {
            text:'Email',
            isSorted:true,
            width:'150px',
            cell:{                
                dataField:'userEmail',
                type:'email'
            },
            filter:{
                type:'string'
            }
        },
        {
            text:'Method',
            isSorted:true,
            cell:{
                dataField:'httpVerb'
            },
            filter:{
                type:'multi-select',
                typeOptions:{
                    items: this.getMethodList(),
                    hideFilter:true,
                    hideButtons:true
                }
            }
        },
        {
            text:'Url',
            isSorted:true,
            width:'370px',
            cell:{
                dataField:'httpUrl',
                type:'url'
            },
            filter:{
                type:'string'
            }
        },
        {
            text:'Status',
            isSorted:true,
            cell:{
                dataField:'httpStatusCode'
            }
        },
        {
            text:'Finished',
            isSorted:true,
            cell:{
                dataField:'finishedAt',
                type:'custom',
                typeOptions:{
                    parseFunction: this.getDateTime.bind(this) // If without .bind did it, then return UserActivityModel
                }
            },
            filter:{
                type:'between-date-time'
            }
        }
    ];
};

UserActivityModel.prototype.init = function(){
    this.grid = new GridModel({
        actionPanel:{
            title:'User Activity',
            showStrip:true
        },
        columns:this.columns,
        filters:{limit:20, order:'startedAt DESC'}
    });

    this.dataLoader =   new DataLoader({
        serviceName:'useractivity',
        grid:       this.grid,
        onLoad:     this.getDataLoadedHandle()
    });

    return this;
};

UserActivityModel.prototype.getDataLoadedHandle = function(){
    const self = this,
        binding = self.getDefaultBinding();

    return function(data){
        binding.set('data', self.grid.table.data);
    };    
};

module.exports = UserActivityModel;