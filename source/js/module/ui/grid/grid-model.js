/**
 * Created by Anatoly on 21.07.2016.
 */

const 	FilterModel 		= require('./filter/model/filter-model'),
		FilterPanelModel 	= require('./filter/model/filter-panel-model'),
		PaginationModel 	= require('./filter/model/pagination-model'),
		ActionPanelModel 	= require('./action-panel/action-panel-model'),
		TableModel 			= require('./table/model/table-model'),
		Lazy 				= require('lazy.js');

/**
 * GridModel - model for Grid class
 *
 * @param {object} 	options - options Grid class
 * @param {object} 	options.actionPanel - options ActionPanel class
 * @param {func} 	options.actionPanel.btnAdd - react component for 'Add' button
 * @param {string} 	options.actionPanel.title - grid Title
 * @param {boolean}	options.actionPanel.showStrip - show strip after title
 * @param {boolean}	options.actionPanel.showSearch - show 'search' input
 * @param {boolean}	options.actionPanel.showBtnPrint - show 'print' button
 * @param {boolean}	options.actionPanel.showBtnLoad - show 'load' button
 * @param {boolean}	options.actionPanel.hideBtnFilter - hide 'filter' button
 * @param {object[]} options.columns - array of columns
 * @param {string}	options.columns[].text - the text in the column header
 * @param {boolean}	options.columns[].isSorted - adds sorting column
 * @param {boolean}	options.columns[].hidden - hidden column (if you need to add the ability to filter data without prompting)
 * @param {number}	options.columns[].width - specifies the width of a column
 * @param {object} 	options.columns[].cell - cell parameters
 * @param {string} 	options.columns[].cell.type - specifies the type of cell variability rendering
 * @param {object} 	options.columns[].cell.typeOptions - additional options for rendering cells
 * @param {string} 	options.columns[].cell.dataField - data field name
 * @param {string} 	options.columns[].filter.type - filter type
 * @param {object} 	options.columns[].filter.typeOptions - additional filter options
 * @param {object} 	options.filters - a set of predefined filters to Filter class.
 *
 * For example
 * options = {
		actionPanel:{
			title:'Users & Permissions',
			showStrip:true
		},
		columns:[
			{
				text:'Name',
				isSorted:true,
				cell:{
					dataField:'firstName'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Surname',
				isSorted:true,
				cell:{
					dataField:'lastName'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Actions',
				cell:{
					type:'custom',
					typeOptions:{
						parseFunction:this.getActions.bind(this)
					}
				}
			}
		],
		filters:{limit:20}
	}
 *
 * */
const GridModel = function(options){
	this.filter = new FilterModel(options.filters);
	this.filter.onChange.on(this.render.bind(this));

	this.table = new TableModel({
		columns:options.columns,
		onSort:this.filter.setOrder.bind(this.filter)
	});
	this.pagination = new PaginationModel(this.filter);
	this.filterPanel = new FilterPanelModel({
		filter:this.filter,
		badges:options.badges,
		columns:options.columns
	});
	this.actionPanel = new ActionPanelModel(options.actionPanel);
	//If true we add extra class to css
	this.classStyleAdmin = options.classStyleAdmin;
	//The function, which will call when user click on <Row> in Grid
	this.handleClick = options.handleClick;
	this.actionPanel.onChange = this.render.bind(this);
	this.onRender = null;
};

GridModel.prototype.setData = function(data){
	if(this.filter.isChangePage){
		this.table.data = Lazy(this.table.data.concat(data)).uniq('id').toArray();
	} else {
		this.table.data = data;
	}
	this.filter.setNumberOfLoadedRows(data.length);
	this.onRender && this.onRender();
};
GridModel.prototype.render = function(){
	this.onRender && this.onRender();
};


module.exports = GridModel;

