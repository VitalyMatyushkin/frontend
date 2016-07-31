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
	this.filter = options.filter;
	this.filter.onChange = this.onChangeFilter.bind(this);

	this.onLoad = options.onLoad;

	this.loadData();

};

DataLoader.prototype = {
	getService:function(serviceName){
		if(!serviceName) {
			console.error('Grid.DataLoader: service name missed!');
			return null;
		}

		const service = window.Server[serviceName];

		if(!service){
			console.error('Grid.DataLoader: service not found!');
		}

		return service;
	},
	loadData:function(){
		const self = this,
			filters = self.filter.getFilters(),
			service = self.getService(self.serviceName);

		console.log('Grid.DataLoader: load data started');
		if(service) {
			const promise = self.params ? service.get(self.params, filters): service.get(filters);
			return promise.then(function (data) {
				var res = data;
				if(self.dataModel){
					res = data.map(function(item){
						return new self.dataModel(item);
					});
				}
				self.onLoad && self.onLoad(res);
				self.filter.setNumberOfLoadedRows(res.length);
				return res;
			});
		}
	},
	onChangeFilter: function(){
		this.loadData();
	}
};


module.exports = DataLoader;
