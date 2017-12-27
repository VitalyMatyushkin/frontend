/**
 * Created by Anatoly on 22.07.2016.
 */


import {GridModel} from "module/ui/grid/grid-model";
import {PromiseHelper} from "module/helpers/promise_helper";

/**
 * DataLoader
 *
 * @param {object} options
 *
 * */
interface DataLoaderOptions {
    serviceName: string
    dataModel?: any
    modelParams?: any
    params?: any
    grid: GridModel
    onLoad: any
}



export class DataLoader {

    serviceName: string;
    dataModel?: any;
    modelParams?: any;
    params?: any;
    grid: GridModel;
    filter: any;
    onLoad: any;
    loadDataTimer: any;

    constructor(options: DataLoaderOptions) {
        this.serviceName = options.serviceName;
        this.dataModel = options.dataModel;
        this.modelParams = options.modelParams;
        this.params = options.params;
        this.grid = options.grid;
        this.filter = this.grid.filter;
        this.filter.onChange.on(this.onChangeFilter.bind(this));

        this.onLoad = options.onLoad;
        this.loadDataTimer = null;

        this.loadData();
    }

    getService(serviceName: string) {
        if(!serviceName) {
            console.error('Grid.DataLoader: service name missed!');
            return null;
        }

        const service = (window as any).Server[serviceName];		// TODO: why you getting services by their names instead of passing service itself ?

        if(!service){
            console.error('Grid.DataLoader: service not found!');
        }

        return service;
    }

    doRequest(filters: any) {
        const service = this.getService(this.serviceName);

        return this.params ? service.get(this.params, filters): service.get(filters);
    }

	doRequestWithCurrentFilterAndNoLimit() {
    	const INCREMENT_VALUE = 200;
		const filters = Object.assign({}, this.filter.getFilters());
		if(
			typeof filters.filter.where !== 'undefined' &&
			typeof filters.filter.where.filterPermissionStatus !== 'undefined'
		) {
			delete filters.filter.where.filterPermissionStatus;
		}
		filters.filter.skip = 0;
		filters.filter.limit = 200;

		const p = new PromiseHelper();

		let allData = [];
		return p.promiseFor(
			length => {
				return length !== 0;
			},
			() => {
				const copyFilters = Object.assign({}, filters);

				return this.doRequest(copyFilters).then(
					data => {
						allData = allData.concat(data);

						filters.filter.skip += INCREMENT_VALUE;

						return data.length;
					},
					error => {
						console.error(error);

						return 0;
					}
				)
			},
			1000
		).then(() => {
			return allData;
		});
	}

    loadData() {
        const   filters = this.filter.getFilters(),
                service = this.getService(this.serviceName);

        let modelParams = null;
        if(service) {
            /*
            Temporary feature, it will be deleted, when it will be realized on server. Now filter works only on frontend.
             It works for 'User&Permission' table by superadmin.  Grid model - UserModel
            filterPermissionStatus - this is unique field name, it will be deleted after request to server.
            */
            if(filters.filter.where && filters.filter.where.filterPermissionStatus){
                modelParams = filters.filter.where.filterPermissionStatus.$in;
                delete filters.filter.where.filterPermissionStatus;
            }
            const promise = this.doRequest(filters);
            return promise.then(data => {
                /*
                 Added this filter back, that this filter worked, when added new filter after this
                 */
                if(this.filter.where){
                    this.filter.where.filterPermissionStatus = {$in: modelParams};
                }
                let res = data;
                if(this.dataModel){
                    res = data.map( item => {
                        return new this.dataModel(item, modelParams);
                    });
                }
                this.grid.setData(res);
                this.onLoad && this.onLoad(res);
                return res;
            });
        }
    }

    onChangeFilter(){
        //The value has changed before sending the request to the server. We reset the timer and start it again.
        clearTimeout(this.loadDataTimer);
        // we use Debouncing method
        this.loadDataTimer = setTimeout(this.loadData.bind(this),400);
    }
}