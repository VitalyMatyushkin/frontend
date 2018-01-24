/**
 * Created by vitaly on 04.12.17.
 */

import {DataLoader}     from 'module/ui/grid/data-loader';
import {GridModel}      from 'module/ui/grid/grid-model';
import * as Timezone    from 'moment-timezone';
import {Tournament}     from 'module/as_manager/pages/tournaments/tournament';
import {ServiceList} from "module/core/service_list/service_list";

/**
 * TournamentsModel
 *
 * @param {object} page
 *
 **/
export class TournamentsModel{

    getDefaultBinding: any;
    getMoreartyContext: any;
    props: any;
    state: any;
    rootBinding: any;
    activeSchoolId: string;
    columns: any[];
    grid: GridModel;
    dataLoader: DataLoader;

    constructor(page: any){
        this.getDefaultBinding = page.getDefaultBinding;
        this.getMoreartyContext = page.getMoreartyContext;
        this.props = page.props;
        this.state = page.state;

        this.rootBinding = this.getMoreartyContext().getBinding();
        this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');
        const binding = this.getDefaultBinding();
        this.getSportsFromServer().then(sports => binding.set('sports', sports));
        this.setColumns();
    }

    getSportName(item: any): string {
        const	sportId	    = item.sportId,
                binding	    = this.getDefaultBinding(),
                sports		= binding.get('sports'),
                foundSport	= typeof sports !== 'undefined' ? sports.find(s => s.id === sportId) : undefined,
                name		= typeof foundSport !== 'undefined' ? foundSport.name : '';

        return name;
    }

    getSportsFromServer(): any {
        return (window.Server as ServiceList).sports.get({filter:{limit:1000}});
    }

    getStartTime(item: any): string {
        return Timezone.tz(item.startTime, (<any>window).timezone).format('DD.MM.YY HH:mm');
    }

    getEndTime(item: any): string {
        return Timezone.tz(item.endTime, (<any>window).timezone).format('DD.MM.YY HH:mm');
    }

    setColumns(): void {
        this.columns = [
            {
                text:'Logo',
                isSorted: false,
                cell:{
                    dataField:'photos',
                    type:'image'
                }
            },
            {
                text:'Name',
                isSorted:  true,
                cell:{
                    dataField:'name'
                },
                filter:{
                    type:'string'
                }
            },
            {
                text:'Sport',
                isSorted:  true,
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
                        getDataPromise: this.getSportsFromServer(),
                        keyField:'id',
                        valueField:'name'
                    },
                }
            },
            {
                text:'Start Time',
                isSorted:  true,
                cell:{
                    dataField:'startTime',
                    type:'custom',
                    typeOptions:{
                        parseFunction: this.getStartTime.bind(this)
                    }
                },
                filter:{
                    type:'between-date-time'
                }
            },
            {
                text:'End time',
                isSorted:  true,
                cell:{
                    dataField:'endTime',
                    type:'custom',
                    typeOptions:{
                        parseFunction: this.getEndTime.bind(this)
                    }
                },
                filter:{
                    type:'between-date-time'
                }
            },
            {
                text:'Url',
                isSorted:  true,
                cell:{
                    dataField:'link',
                    type:'url'
                },
                filter:{
                    type:'string'
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

    onEdit(tournament: Tournament, eventDescriptor: any) {
        document.location.hash += `/edit?id=${tournament.id}`;
        eventDescriptor.stopPropagation();
    }

    onRemove(tournament: Tournament, eventDescriptor: any) {
        (<any>window).confirmAlert(
            `Are you sure you want to remove tournament ${tournament.name}?`,
            "Ok",
            "Cancel",
            () => (<any>window).Server.schoolTournament
                .delete(
                    {
                        schoolUnionId: this.activeSchoolId,
                        tournamentId: tournament.id
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
                title:      'Tournaments',
                showStrip:  true,
                btnAdd:     this.props.addButton
            },
            columns:this.columns,
            filters:{limit:20, order:'startedAt DESC'}
        });

        this.dataLoader =   new DataLoader({
            serviceName:'schoolTournaments',
            params:     {schoolUnionId: this.activeSchoolId},
            grid:       this.grid,
            onLoad:     this.getDataLoadedHandle()
        });

        return this;
    };

    createGridFromExistingData(grid: any){

        this.grid = new GridModel({
            actionPanel:{
                title:      'Tournaments',
                showStrip:  true,
                btnAdd:     this.props.addButton
            },
            columns:this.columns,
            filters: {
                where: grid.filter.where,
                order: grid.filter.order
            },
            badges: grid.filterPanel.badgeArea
        });

        this.dataLoader =   new DataLoader({
            serviceName:'schoolTournaments',
            params:     {schoolUnionId: this.activeSchoolId},
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