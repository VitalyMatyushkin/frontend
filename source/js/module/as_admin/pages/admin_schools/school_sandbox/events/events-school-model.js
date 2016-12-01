/**
 * Created by Anatoly on 30.11.2016.
 */

const 	DataLoader 		= require('module/ui/grid/data-loader'),
    React 			= require('react'),
    Morearty		= require('morearty'),
    DateHelper      = require('module/helpers/date_helper'),
    EventHelper     = require('module/helpers/eventHelper'),
    GridModel 		= require('module/ui/grid/grid-model');

/**
 * EventsSchoolModel
 *
 * @param {object} page
 *
 * */
const EventsSchoolModel = function(page){
    this.getDefaultBinding = page.getDefaultBinding;
    this.getMoreartyContext = page.getMoreartyContext;
    this.props = page.props;
    this.state = page.state;

    const binding = this.getDefaultBinding();
    this.getSports().then(sports => binding.set('sports', sports));
    this.getSchoolList().then(schools => binding.set('schools', schools));

    this.setColumns();
    this.grid = new GridModel({
        actionPanel:{
            title:'Events',
            showStrip:true
        },
        columns:this.columns,
        filters:{limit: 20}
    });

    const   globalBinding   = this.getMoreartyContext().getBinding(),
            schoolId        = globalBinding.get('routing.pathParameters.0');

    this.dataLoader =   new DataLoader({
        serviceName:    'events',
        params:         {schoolId:schoolId},
        grid:           this.grid,
        onLoad:         this.getDataLoadedHandle()
    });

};

EventsSchoolModel.prototype.getSchoolList = function(){
    return window.Server.schools.get({filter:{limit:1000}});
};

EventsSchoolModel.prototype.getOpponentName = function(item){
    const opponentId = item.invitedSchoolIds,
            binding = this.getDefaultBinding();

    const   schools      = binding.get('schools'),
            foundSchool  = typeof schools !== 'undefined' ? schools.find(s => s.id == opponentId) : undefined,
            name        = typeof foundSchool !== 'undefined' ? foundSchool.name : '';

    return name;
};

EventsSchoolModel.prototype.getDateTime = function(item){
    return DateHelper.getDateTimeString(item.endRegistrationTime);
};

EventsSchoolModel.prototype.getSports = function () {
    return window.Server.sports.get({filter:{limit:1000}});
};

EventsSchoolModel.prototype.getSportName = function (item) {
    const sportId = item.sportId,
            binding = this.getDefaultBinding();

    const   sports      = binding.get('sports'),
            foundSport  = typeof sports !== 'undefined' ? sports.find(s => s.id === sportId) : undefined,
            name        = typeof foundSport !== 'undefined' ? foundSport.name : '';

    return name;
};

EventsSchoolModel.prototype.setColumns = function(){
    this.columns = [
        {
            text:'Name',
            isSorted:false,
            cell:{
                dataField:'name',
                type:'general'
            }
        },
        {
            text:'Sport',
            isSorted:true,
            cell:{
                dataField:'sportId',
                type:'custom',
                typeOptions:{
                    parseFunction: this.getSportName.bind(this)
                }
            },
            filter:{
                type:'multi-select',
                typeOptions:{
                    getDataPromise: this.getSports(),
                    valueField:'name',
                    keyField:'id'
                }
            }
        },
        {
            text:'Opponent',
            isSorted:true,
            cell:{
                dataField:'invitedSchoolIds',
                type:'custom',
                typeOptions:{
                    parseFunction: this.getOpponentName.bind(this)
                }
            },
            filter:{
                type:'multi-select',
                typeOptions:{
                    getDataPromise: this.getSchoolList(),
                    valueField:'name',
                    keyField:'id'
                }
            }
        },
        {
            text:'Gender',
            isSorted:true,
            cell:{
                dataField:'gender',
                type:'gender'
            },
            filter:{
                type:'multi-select',
                typeOptions:{
                    items: EventHelper.getGenderListEvent(),
                    hideFilter:true,
                    hideButtons:true
                }
            }
        },
        {
            text:'Start Registration Date, Time',
            isSorted:true,
            cell:{
                dataField:'startRegistrationTime',
                type:'custom',
                typeOptions:{
                    parseFunction: this.getDateTime.bind(this)
                }
            },
            filter:{
                type:'between-date'
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
                    items: EventHelper.getStatusListEvent(),
                    hideFilter:true,
                    hideButtons:true
                }
            }
        }
    ];
};

EventsSchoolModel.prototype.getDataLoadedHandle = function(){
    const binding = this.getDefaultBinding();

    return function(data){
        binding.set('data', this.grid.table.data);
    };
};

module.exports = EventsSchoolModel;
