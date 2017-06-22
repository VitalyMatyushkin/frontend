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
 * TeamListClass
 *
 * @param {object} page
 *
 * */
class TeamListModel {
	constructor(page) {
		this.getDefaultBinding = page.getDefaultBinding;
		this.getMoreartyContext = page.getMoreartyContext;
		this.props = page.props;
		this.state = page.state;
		this.rootBinding = this.getMoreartyContext().getBinding();
		this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');
		
		this.setColumns();
		const binding = this.getDefaultBinding();
		this.getSportsFromServer().then(sports => binding.set('sports', sports));
	}
	
	reloadData() {
		this.dataLoader.loadData();
	}
	
	onEditClick(data, event) {
		document.location.hash += '/edit?id=' + data.id;
		event.stopPropagation();
	}
	
	onItemClick(data, event) {
		document.location.hash += `/players?id=${data.id}&name=${data.name}`;
		event.stopPropagation();
	}
	
	onRemoveClick(team, event) {
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
	}
	
	/**
	 * Function return string with all Age Groups
	 * @param {object} object of team
	 * @returns {string}
	 */
	getAges(item) {
		const ages = item.ages;
		
		if(typeof ages !== 'undefined') {
			return ages
			.map( elem => elem === 0 ? 'Reception' : `Y${elem}`)
			.join(", ");
		}
	}
	
	getGenderIcon(item) {
		return <GenderIcon classes="bIcon-gender" gender={item.gender}/>;
	}
	
	getGenderArray() {
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
	}
	
	getSportsFromServer() {
		return window.Server.sports.get({filter:{limit:1000}});
	}
	
	getSportName(item) {
		const	self	= this,
			sportId	= item.sportId,
			binding	= self.getDefaultBinding();
		
		const	sports		= binding.get('sports'),
			foundSport	= typeof sports !== 'undefined' ? sports.find(s => s.id === sportId) : undefined,
			name		= typeof foundSport !== 'undefined' ? foundSport.name : '';
		
		return name;
	}
	
	getSportIcon(item) {
		return <Sport name={this.getSportName(item)} className="bIcon_invites" />;
	}
	
	setColumns() {
		this.columns = [
			{
				cell:{
					type:'custom',
					typeOptions:{
						parseFunction: this.getSportIcon.bind(this)
					}
				}
			},
			{
				text:'Sport',
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
                    id:'find_team_sport'
				}
			},
			{
				text:'Name',
				isSorted:true,
				cell:{
					dataField:'name'
				},
				filter:{
					type:'string',
					id:'find_team_name'
				}
			},
			{
				text:'Description',
				isSorted:true,
				cell:{
					dataField:'description'
				},
				filter:{
					type:'string',
                    id:'find_team_description'
				}
			},
			{
				text:'Gender',
				cell:{
					dataField:'gender',
					type:'custom',
					typeOptions:{
						parseFunction: this.getGenderIcon.bind(this)
					}
				},
				filter:{
					type:'multi-select',
					typeOptions:{
						items: this.getGenderArray(),
						hideFilter:true,
						hideButtons:true
					},
                    id:'find_team_gender'
				}
			},
			{
				text:'Ages',
				cell:{
					dataField:'ages',
					type:'custom',
					typeOptions:{
						parseFunction: this.getAges.bind(this)
					}
				}
			},
			{
				text:'Actions',
				cell:{
					type:'action-buttons',
					typeOptions:{
						onItemEdit:		this.onEditClick.bind(this),
						onItemSelect:	this.onItemClick.bind(this),
						onItemRemove:	this.onRemoveClick.bind(this)
					}
				}
			}
		];
	}
	
	createGrid() {
		
		this.grid = new GridModel({
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
			columns:this.columns,
			handleClick: this.props.handleClick,
			filters: {
				limit: 100,
				where: {
					removed: false
				}
			}
		});
		
		this.dataLoader = 	new DataLoader({
			serviceName:'teams',
			params:		{schoolId:this.activeSchoolId},
			grid:		this.grid,
			onLoad: 	this.getDataLoadedHandle()
		});
		
		return this;
	}
	
	createGridFromExistingData(grid) {
		
		this.grid = new GridModel({
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
			columns:this.columns,
			handleClick: this.props.handleClick,
			filters: {
				where: grid.filter.where,
				order: grid.filter.order
			},
			badges: grid.filterPanel.badgeArea
		});
		
		this.dataLoader = 	new DataLoader({
			serviceName:'teams',
			params:		{schoolId:this.activeSchoolId},
			grid:		this.grid,
			onLoad: 	this.getDataLoadedHandle()
		});
		
		return this;
	}
	
	getDataLoadedHandle() {
		const self = this,
			binding = self.getDefaultBinding();
		
		return function(){
			binding.set('data', self.grid.table.data);
		};
	}
	
};

module.exports = TeamListModel;
