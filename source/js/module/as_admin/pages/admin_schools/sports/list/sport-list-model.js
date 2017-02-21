/**
 * Created by Anatoly on 18.08.2016.
 */

const 	React 			= require('react'),
		Morearty		= require('morearty'),
		SVG 			= require('module/ui/svg'),
		Sport 			= require('module/ui/icons/sport_icon'),
		DataLoader 		= require('module/ui/grid/data-loader'),
		GridModel 		= require('module/ui/grid/grid-model');

/**
 * SportListModel
 *
 * @param {object} page
 *
 * */
const SportListModel = function(page){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;

	this.rootBinding = this.getMoreartyContext().getBinding();

	this.grid = this.getGrid();
	this.dataLoader = 	new DataLoader({
		serviceName:'sports',
		grid:		this.grid,
		onLoad: 	this.getDataLoadedHandle()
	});
};

SportListModel.prototype = {
	reloadData:function(){
		this.dataLoader.loadData();
	},
	onEdit: function(data) {
		document.location.hash += '/edit?id=' + data.id;
	},
	onRemove: function(data) {
		const self = this;

		window.confirmAlert(
			"Do you really want to remove this sport?",
			"Ok",
			"Cancel",
			() => window.Server.sport.delete({sportId: data.id}).then(_ => self.reloadData()),
			() => {}
		);
	},
	getGrid: function(){
		const columns = [
			{
				cell:{
					type:'custom',
					typeOptions:{
						parseFunction: item => <Sport name={item.name} className='bIcon_invites ' />
					}
				}
			},
			{
				text:'Name',
				isSorted:true,
				cell:{
					dataField:'name'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Description',
				isSorted:true,
				cell:{
					dataField:'description'
				},
				filter:{
					type:'string'
				}
			},
			{
				text:'Actions',
				cell:{
					type:'action-buttons',
					typeOptions:{
						onItemEdit:		this.onEdit.bind(this),
						onItemRemove:	this.onRemove.bind(this)
					}
				}
			}
		];

		return new GridModel({
			actionPanel:{
				title:'Sports',
				showStrip:true,
				btnAdd:
				(
					<div className="bButtonAdd" onClick={function(){document.location.hash += '/add';}}>
						<SVG icon="icon_add_sport" />
					</div>
				)
			},
			columns:columns,
			filters:{limit:50}
		});
	},
	getDataLoadedHandle: function(data){
		const self = this,
			binding = self.getDefaultBinding();

		return function(data){
			binding.set('data', self.grid.table.data);
		};
	}
};


module.exports = SportListModel;
