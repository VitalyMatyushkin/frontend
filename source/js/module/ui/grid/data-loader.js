/**
 * Created by Anatoly on 22.07.2016.
 */


/**
 * DataLoader
 *
 * @param {object} options
 *
 * */
const DataLoader = function(options){
	this.serviceName = options.serviceName;
	this.dataModel = options.dataModel;
	this.params = options.params;
	this.grid = options.grid;
	this.filter = this.grid.filter;
	this.filter.onChange.on(this.onChangeFilter.bind(this));

	this.onLoad = options.onLoad;
	this.loadDataTimer = null;

	this.loadData();
};

DataLoader.prototype = {
	getService:function(serviceName){
		if(!serviceName) {
			console.error('Grid.DataLoader: service name missed!');
			return null;
		}

		const service = window.Server[serviceName];		// TODO: why you getting services by their names instead of passing service itself ?

		if(!service){
			console.error('Grid.DataLoader: service not found!');
		}

		return service;
	},
	loadData:function(){
		const 	self = this,
				filters = this.filter.getFilters(),
				service = this.getService(self.serviceName);

		if(service) {
			const promise = self.params ? service.get(this.params, filters): service.get(filters);
			return promise.then(data => {
				var res = data;
				if(self.dataModel){
					res = data.map( item => {
						return new self.dataModel(item);
					});
				}
				self.grid.setData(res);
				self.onLoad && self.onLoad(res);
				return res;
			});
		}
	},
	onChangeFilter: function(){
		//The value has changed before sending the request to the server. We reset the timer and start it again.
		clearTimeout(this.loadDataTimer);
		// we use Debouncing method
		this.loadDataTimer = setTimeout(this.loadData.bind(this),400);
	}
};


module.exports = DataLoader;
