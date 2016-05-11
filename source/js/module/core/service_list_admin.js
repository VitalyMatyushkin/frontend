const 	Service 		    = require('module/core/service'),
		ImageService 	    = require('module/core/services/ImageService'),
        FilteringServices 	= require('module/core/services/FilteringServices');


/** Collection of services to reach REST API from server */
const serviceList = {
	// Services which require authorization
	initialize: function(binding) {
        // authorization
        serviceList._login = new Service('/superadmin/login',binding);

        // users
		serviceList.users = new Service('/superadmin/users', binding);
        serviceList.user = new Service('/superadmin/users/{userId}', binding);
        serviceList.usersCount = new Service('/superadmin/users/count', binding);

        //Permission Requests
        serviceList.permissionRequests = new Service('/superadmin/users/permissions/requests',binding);
        serviceList.permissionRequestsCount = new Service('/superadmin/users/permissions/requests/count',binding);
        serviceList.permissionRequest = new Service('/superadmin/users/permissions/requests/{prId}',binding);
        serviceList.statusPermissionRequest = new Service('/superadmin/users/permissions/requests/{prId}/status',binding);

        //Permissions
        serviceList.userPermissions = new Service('/superadmin/users/{userId}/permissions',binding);
        serviceList.userPermission = new Service('/superadmin/users/{userId}/permissions/{permissionId}',binding);

        // schools
        serviceList.schools = new Service('/superadmin/schools', binding);
        serviceList.school = new Service('/superadmin/schools/{schoolId}', binding);
        serviceList.publicSchools = new Service('/public/schools', binding);

        // sports
        serviceList.sports = new Service('/superadmin/sports', binding);
        serviceList.sport =  new Service('/superadmin/sports/{sportId}', binding);

        // postcode
        serviceList.postCode = new Service('/superadmin/postcodes', binding);

        // forms
        serviceList.schoolForms = new Service('/superadmin/schools/{schoolId}/forms', binding);
        serviceList.schoolForm = new Service('/superadmin/schools/{schoolId}/forms/{formId}', binding);

        // houses
        serviceList.schoolHouses = new Service('/superadmin/schools/{schoolId}/houses', binding);
        serviceList.schoolHouse = new Service('/superadmin/schools/{schoolId}/houses/{houseId}', binding);

        // students
        serviceList.schoolStudents = new Service('/superadmin/schools/{schoolId}/students', binding);
        serviceList.schoolStudent = new Service('/superadmin/schools/{schoolId}/students/{studentId}', binding);










        serviceList.userChildren = new Service('/users/{id}/children', binding);
		serviceList.userChildrenEvents = new Service('/users/{id}/children/events', binding);
		serviceList.userCoach = new Service('/users/{id}/coaches',binding);
		serviceList.userManager = new Service('/users/{id}/managers',binding);
		serviceList.userTeacher = new Service('/users/{id}/teachers',binding);
		serviceList.userAdmin = new Service('/users/{id}/admins',binding);
		serviceList.userPasswordReset = new Service('/users/reset',binding);
		serviceList.confirmUser = new Service('/users/confirm?uid={uid}&token={token}',binding);
		serviceList.confirmUserPhone = new Service('/users/confirmPhone?uid={uid}&token={token}',binding);
        serviceList.getTotalNumberOfUserModels = new Service('/users/count',binding);

		serviceList.schoolInfo = new Service('/schools/findOne?filter[where][id]={id}&filter[include]=postcode', binding);
		serviceList.manager= new Service('/schools/{id}/managers/rel/{fk}',binding);
		serviceList.administrator = new Service('/schools/{id}/admins/rel/{fk}',binding);
		serviceList.addCoach = new Service('/schools/{id}/coaches/rel/{fk}',binding);
		serviceList.addTeacher = new Service('/schools/{id}/teachers/rel/{fk}',binding);
		serviceList.getThisSchool = new Service('/schools/getAllSchools',binding);

		serviceList.fixturesVsOtherSchool = new Service('/schools/{schoolId}/events/{opponentId}', binding);
		serviceList.fixturesBySchoolId = new Service('/schools/public/events?schoolId={schoolId}', binding);

		serviceList.eventsBySchoolId = new Service('/schools/{schoolId}/events', binding);
		serviceList.ownerSchools = new Service('/schools?filter[where][ownerId]={ownerId}', binding);
		serviceList.schoolOpponents = new Service('/schools/{id}/public/opponents', binding);
		serviceList.getAllSchools = new Service('/schools/getAllSchools', binding);
		serviceList.getMaSchools = new Service('/schools/getMaSchools', binding);

		// students
		serviceList.studentData = new Service('/students/{studentId}/user',binding);
		serviceList.studentGamesWon = new Service('/students/{id}/events/won?include={include}', binding);
		serviceList.studentGamesScored = new Service('/students/{id}/events/scored?include={include}', binding);
		serviceList.studentEvents = new Service('/students/{id}/events', binding);
		serviceList.studentParent = new Service('/students/{id}/parents',binding);
		serviceList.getAllStudents = new Service('/students', binding);
		serviceList.studentScored = new Service('/students/{id}/events/scored',binding);
		serviceList.studentWon = new Service('/students/{id}/events/won',binding);
		serviceList.studentUser = new Service('/users/{id}/students',binding);
		serviceList.addStudentToSchool = new Service('/schools/{id}/students',binding);
		serviceList.updateStudentOfAschool = new Service('/schools/{id}/students/{fk}');

		// coaches
		serviceList.schoolCoaches = new Service('/schools/{id}/coaches', binding);
		serviceList.oneSchoolCoache = new Service('/schools/{schoolId}/coaches/{id}', binding);

		//Admins
		serviceList.schoolAdmins = new Service('/schools/{id}/admins',binding);
		serviceList.schoolManager = new Service('/schools/{id}/managers',binding);
		serviceList.schoolTeacher = new Service('/schools/{id}/teachers',binding);

		// news
		serviceList.news = new Service('/schools/{schoolId}/news', binding);
		serviceList.newsCount = new Service('/schools/{schoolId}/news/count', binding);
		serviceList.oneNews = new Service('/news/{formId}', binding);

		//events
		serviceList.events = new Service('/events', binding);
		serviceList.eventFindOne = new Service('/events/findOne', binding);
		serviceList.event = new Service('/events/{eventId}', binding);
		serviceList.participants = new Service('/events/{eventId}/participants', binding);
		serviceList.relParticipants = new Service('/events/{eventId}/participants/rel/{teamId}', binding);


		// invites
		serviceList.invites = new Service('/invites', binding);
		serviceList.invitesFindOne = new Service('/invites/findOne', binding);
		serviceList.invite = new Service('/invites/{inviteId}', binding);
		serviceList.invitesByEvent = new Service('/events/{eventId}/invites', binding);
		serviceList.inviteRepay = new Service('/invites/{inviteId}/repay', binding);

		// teams
		serviceList.teams = new Service('/teams', binding);
		serviceList.team = new Service('/teams/{teamId}', binding);
		serviceList.teamsBySchoolId = new Service('/teams?filter[where][schoolId]={schoolId}&filter[include]=events', binding);
		serviceList.playersRelation = new Service('/teams/{teamId}/players/rel/{studentId}', binding);
		serviceList.playersByTeam = new Service('/teams/{teamId}/players', binding);
		serviceList.exactlyPlayersByTeam = new Service('/teams/{teamId}/exactlyPlayers/{playerId}', binding);

		//players
		serviceList.players = new Service('/players', binding);

		// result
		serviceList.results = new Service('/results', binding);
		serviceList.result = new Service('/results/{id}', binding);
		serviceList.resultByEvent = new Service('/results/{id}/event', binding);

		// points
		serviceList.pointsInResult = new Service('/results/{resultId}/points', binding);
		serviceList.studentPoints = new Service('/points?filter[where][studentId]={studentId}', binding);
		serviceList.points = new Service('/points', binding);

		serviceList.findPostCodeById = new Service('/postcodes/findOne?filter[where][id]={postCode}', binding);

		// albums
		serviceList.albumsByEvent = new Service('/events/{id}/albums');
		serviceList.addAlbum = new Service('/albums', binding);
		serviceList.albumsFindOne = new Service('/albums/findOne', binding);
		serviceList.album = new Service('/albums/{albumId}', binding);

		// photos
		serviceList.photos = new Service('/albums/{albumId}/photos', binding);
		serviceList.addPhoto = new Service('/albums',binding);
		serviceList.photo = new Service('/photos/{photoId}', binding);

		//Storage
		// TODO: DROP THIS SHIT
		serviceList.storage = new Service('/storage',binding);
		serviceList.addToStorageFiles = new Service('/storage/{container}/files',binding);

		//Blog
		serviceList.addToBlog = new Service('/events/{id}/comments',binding);
		serviceList.replyToBlog = new Service('/events/{id}/comments/rel/{fk}',binding);
		serviceList.getCommentCount = new Service('/events/{id}/comments/count',binding);

		//Activity Logs
		serviceList.activityLogs = new Service('/logs',binding);
		serviceList.logCount = new Service('/logs/count',binding);

		serviceList.parentRequests = new Service('/parentRequests', binding);
		serviceList.parentRequest = new Service('/parentRequests/{id}', binding);
		serviceList.childRequests = new Service('/parentRequests/{id}/childRequests', binding);

        //Filtering services
        serviceList.publicSchools.filter = FilteringServices.allSchoolsFiltering;       //(filter)
        serviceList.getMaSchools.filter = FilteringServices.maSchoolsFiltering;         //(filter)
        serviceList.schoolStudents.filter = FilteringServices.studentsFilteringByLastName;    //(schoolId, filter)

	},
	// Services which not require authorization
	initializeOpenServices: function() {
		// schools
		serviceList.schoolsFindOne = new Service('/schools/getAllSchools');
		
		/* I don't like idea of using window.apiImg here, but it was easiest solution withoug global refactoring */
		serviceList.images = new ImageService(window.apiImg);
	}
};

serviceList.initializeOpenServices();


module.exports = serviceList;
