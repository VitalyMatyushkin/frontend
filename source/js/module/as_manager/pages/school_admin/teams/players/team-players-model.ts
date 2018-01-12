/**
 * Created by Anatoly on 22.08.2016.
 */
import * as userConst from 'module/helpers/consts/user';
import * as StudentListClass from './../../students/list/student-list-class';

export class TeamPlayersClass{

	getDefaultBinding: 	any;
	getMoreartyContext: any;
	props: 				any;
	state: 				any;
	rootBinding: 		any;
	activeSchoolId: 	string;
	columns: 			any[];
	teamId: 			string;
	model: 				any;

	constructor(page: any){
		this.getDefaultBinding 		= page.getDefaultBinding;
		this.getMoreartyContext 	= page.getMoreartyContext;
		this.props 					= page.props;
		this.state 					= page.state;
		this.rootBinding 			= this.getMoreartyContext().getBinding();
		this.activeSchoolId 		= this.rootBinding.get('userRules.activeSchoolId');
		
		const 	teamId 		= this.rootBinding.get('routing.parameters.id'),
				teamName 	= this.rootBinding.get('routing.parameters.name');
		
		this.teamId 	= teamId;
		this.model 		= new StudentListClass(page);
		
		this.model.title 	= `Players of ${teamName} team`;
		this.model.btnAdd 	= null;
		//we transmit in model StudentListModel flag 'isTeamView', because we want display column 'Captain' in grid
		this.model.isTeamView 	= true;
	}
	
	createGrid(){
		(window as any).Server.teamPlayers.get(
			{ schoolId: this.activeSchoolId, teamId: this.teamId },
			{ filter: { limit: 100 } }
		).then(data => {
			//we transmit data of team players in model StudentListModel, because in service student we don't get field 'isCaptain'
			this.model.playerData = data;
			
			const ids = data.map(player => player.userId);
			
			this.model.filters = {
				where: {
					id: { $in: ids },
					status: {
						$in: [ userConst.PERMISSION_STATUS.ACTIVE, userConst.PERMISSION_STATUS.BLOCKED, userConst.PERMISSION_STATUS.REMOVED, userConst.PERMISSION_STATUS.ARCHIVED ]
					}
				}
			};
			this.model.createGrid();
		});
		
		return this.model;
	}
	createGridFromExistingData(grid: any){
		(window as any).Server.teamPlayers.get(
			{ schoolId: this.activeSchoolId, teamId: this.teamId },
			{ filter: { limit: 100 } }
		).then(data => {
			//we transmit data of team players in model StudentListModel, because in service student we don't get field 'isCaptain'
			this.model.playerData = data;
			
			this.model.createGridFromExistingData(grid);
		});
		
		return this.model;
	}
}