/**
 * Created by Anatoly on 22.08.2016.
 */

const 	React 			= require('react'),
		Morearty		= require('morearty'),
		SVG 			= require('module/ui/svg'),
		GenderIcon		= require('module/ui/icons/gender_icon'),
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

	const binding = this.getDefaultBinding();
	this.getSports().then(sports => binding.set('sports', sports));

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
	onEdit: function(data, event) {
		document.location.hash += '/edit?id=' + data.id;
		event.stopPropagation();
	},
	onChildren: function(data, event) {
		document.location.hash += `/players?id=${data.id}&name=${data.name}`;
		event.stopPropagation();
	},
	onRemove: function(team, event) {
		const self = this;

		window.confirmAlert(
			`Are you sure you want to remove team ${team.name}?`,
			"Ok",
			"Cancel",
			() => window.Server.team
				.delete( {schoolId:self.activeSchoolId, teamId:team.id} )
				.then(() => self.reloadData()),
			() => {}
		);
		event.stopPropagation();
	},
	/**
	 * Function return string with all Age Groups
	 * @param {object} object of team
	 * @returns {string}
	 */
	_getAges: function(item) {
		const ages = item.ages;

		if(typeof ages !== 'undefined') {
			return ages
				.map( elem => elem === 0 ? 'Reception' : `Y${elem}`)
				.join(", ");
		}
	},
	_getGender: function (item) {
		return <GenderIcon classes="bIcon-gender" gender={item.gender}/>;
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
	getSports:function () {
		return window.Server.sports.get({filter:{limit:1000}});
	},
	_getSportName: function (item) {
		const	self	= this,
				sportId	= item.sportId,
				binding	= self.getDefaultBinding();

		const	sports		= binding.get('sports'),
				foundSport	= typeof sports !== 'undefined' ? sports.find(s => s.id === sportId) : undefined,
				name		= typeof foundSport !== 'undefined' ? foundSport.name : '';

		return name;
	},
	_getSportIcon: function (item) {

		return <Sport name={this._getSportName(item)} className="bIcon_invites" />;
	},
	getGrid: function(){
		const columns = [
			{
				cell:{
					type:'custom',
					typeOptions:{
						parseFunction: this._getSportIcon.bind(this)
					}
				}
			},
			{
				text:'Sport',
				cell:{
					dataField:'sportId',
					type:'custom',
					typeOptions:{
						parseFunction: this._getSportName.bind(this)
					}
				},
				filter:{
					type:'multi-select',
					typeOptions:{
						getDataPromise: this.getSports(),
						keyField:'id',
						valueField:'name'
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
			handleClick: this.props.handleClick,
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
