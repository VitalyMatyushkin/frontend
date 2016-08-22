/**
 * Created by Anatoly on 22.08.2016.
 */

const 	React 			= require('react'),
		Morearty		= require('morearty'),
		SVG 			= require('module/ui/svg'),
		Sport           = require('module/ui/icons/sport_icon'),
		DataLoader 		= require('module/ui/grid/data-loader'),
		GridModel 		= require('module/ui/grid/grid-model');

/**
 * TeamListModel
 *
 * @param {object} page
 *
 * */
const TeamListModel = function(page){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;

	this.rootBinding = this.getMoreartyContext().getBinding();
	this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');

	this.grid = this.getGrid();
	this.dataLoader = 	new DataLoader({
		serviceName:'teams',
		params:		{schoolId:this.activeSchoolId},
		grid:		this.grid,
		onLoad: 	this.getDataLoadedHandle()
	});
};

TeamListModel.prototype = {
	reloadData:function(){
		this.dataLoader.loadData();
	},
	onEdit: function(data) {
		document.location.hash += '/edit?id=' + data.id;
	},
	onChildren: function(data) {
		document.location.hash += '/students?id=' + data.id;
	},
	onRemove: function(team) {
		const 	self 		= this,
				cf 			= confirm(`Are you sure you want to remove team ${team.name}?`);

		if(cf === true){
			window.Server.team.delete({schoolId:self.activeSchoolId, teamId:team.id})
				.then(function(){
					self.reloadData();
				});
		}
	},
	_getAges: function(item) {
		const ages = item.ages;
		let result = '';

		if(ages !== undefined) {
			result = ages.map(elem => {
				return `Y${elem}`;
			}).join(";");
		}

		return result;
	},
	_getGender: function (item) {
		const gender = item.gender;
		let icon;
		switch (gender) {
			case 'MALE_ONLY':
				icon = 'icon_man';
				break;
			case 'FEMALE_ONLY':
				icon = 'icon_woman';
				break;
			case 'MIXED':
				icon = 'icon_mixed';
				break;
			default:
				icon = '';
				break;
		}
		return <SVG classes="bIcon-gender" icon={icon} />;
	},
	getGenders:function(){
		return [
			{
				key:'MALE_ONLY',
				value:'Boys only'
			},
			{
				key:'FEMALE_ONLY',
				value:'Girls only'
			},
			{
				key:'MIXED',
				value:'Mixed'
			}
		];
	},
	_getSport: function (item) {
		const   self    = this,
				sportId = item.sportId,
				binding = self.getDefaultBinding();

		const 	sports 	= binding.get('sports'),
				name 	= sports ? sports.find(s => s.id === sportId).name : '';

		return <Sport name={name} className="bIcon_invites" />;
	},
	getForms:function(){
		return window.Server.schoolForms.get({schoolId:this.activeSchoolId},{filter:{limit:100}});
	},
	getGrid: function(){
		const columns = [
			{
				text:'Sport',
				cell:{
					dataField:'sportId',
					type:'custom',
					typeOptions:{
						parseFunction: this._getSport.bind(this)
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
				text:'Gender',
				cell:{
					dataField:'gender',
					type:'custom',
					typeOptions:{
						parseFunction: this._getGender.bind(this)
					}
				},
				filter:{
					type:'multi-select',
					typeOptions:{
						items: this.getGenders(),
						hideFilter:true,
						hideButtons:true
					}
				}
			},
			{
				text:'Ages',
				cell:{
					dataField:'ages',
					type:'custom',
					typeOptions:{
						parseFunction: this._getAges.bind(this)
					}
				}
			},
			{
				text:'Actions',
				cell:{
					type:'action-buttons',
					typeOptions:{
						onItemEdit:		this.onEdit.bind(this),
						onItemSelect:	this.onChildren.bind(this),
						onItemRemove:	this.onRemove.bind(this)
					}
				}
			}
		];

		return new GridModel({
			actionPanel:{
				title:'Teams',
				showStrip:true,
				btnAdd:
				(
					<div className="addButtonShort bTooltip" data-description="Create Team"
						 onClick={function(){document.location.hash += '/add';}}>
						<SVG icon="icon_add_team" />
					</div>
				)
			},
			columns:columns,
			filters:{
				limit: 100,
				where: {
					removed: false
				}
			}
		});
	},
	getDataLoadedHandle: function(){
		const self = this,
			binding = self.getDefaultBinding();

		return function(){
			binding.set('data', self.grid.table.data);
		};
	}
};


module.exports = TeamListModel;
