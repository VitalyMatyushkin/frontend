/**
 * Created by Anatoly on 22.08.2016.
 */
const  	Morearty			= require('morearty'),
		StudentListClass  	= require('./../../students/list/student-list-class');

const TeamPlayersModel = function(page){
	this.getDefaultBinding = page.getDefaultBinding;
	this.getMoreartyContext = page.getMoreartyContext;
	this.props = page.props;
	this.state = page.state;
	this.rootBinding = this.getMoreartyContext().getBinding();
	this.activeSchoolId = this.rootBinding.get('userRules.activeSchoolId');

	const 	teamId = this.rootBinding.get('routing.parameters.id'),
			teamName = this.rootBinding.get('routing.parameters.name');

	this.model = new StudentListClass(page);

	this.model.title = `Players of ${teamName} team`;
	this.model.btnAdd = null;
	//we transmit in model StudentListModel flag 'team', because we want display column 'Captain' in grid
	this.model.team = true;
	this.getPlayers(teamId);

	return this.model;
};

TeamPlayersModel.prototype.getPlayers = function(teamId){
	window.Server.teamPlayers.get({schoolId:this.activeSchoolId, teamId:teamId},{filter:{limit: 100}})
	.then(data => {
		//we transmit data of team players in model StudentListModel, because in service student we don't get field 'isCaptain'
		this.model.playerData = data;
		const ids = data.map(player => player.userId);
		this.model.filters = {where:{id:{$in:ids}}};
		this.model.init();
	});
};

module.exports = TeamPlayersModel;