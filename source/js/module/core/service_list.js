const 	Service 		    = require('module/core/service'),
		ImageService 	    = require('module/core/services/ImageService'),
        FilteringServices 	= require('module/core/services/FilteringServices');


/** Collection of services to reach REST API from server */
const serviceList = {
	// Services which require authorization
	initialize: function(binding) {
        // authorization
        serviceList._login = new Service('/i/login',binding);
        serviceList.roles = new Service('/i/roles', binding);
        serviceList._become = new Service('/i/roles/{roleName}/become', binding);

        // profile
        serviceList.profile = new Service('/i/profile', binding);
        serviceList.profilePermissions = new Service('/i/permissions', binding);
        serviceList.profilePermission = new Service('/i/permissions/{permissionId}', binding);
        serviceList.profileRequests = new Service('/i/permissions/requests', binding);
        serviceList.profileRequest = new Service('/i/permissions/requests/{prId}', binding);

        // users
        serviceList.confirmUser = new Service('/i/confirm/email',binding);
        serviceList.confirmUserPhone = new Service('/i/confirm/phone',binding);
        serviceList.users = new Service('/i/schools/{schoolId}/users', binding);
        serviceList.usersCount = new Service('/i/schools/{schoolId}/users/count', binding);
        serviceList.user = new Service('/i/schools/{schoolId}/users/{userId}', binding);

        // schools
        serviceList.schools = new Service('/i/schools', binding);
        serviceList.publicSchool = new Service('/public/schools/{schoolId}', binding);
        serviceList.publicSchools = new Service('/public/schools', binding);
        serviceList.school = new Service('/i/schools/{schoolId}', binding);
		serviceList.publicSchoolNews = new Service('/public/schools/{schoolId}/news',binding);
		serviceList.schoolNewsItem = new Service('/i/schools/{schoolId}/news/{newsId}',binding);

        // students
        serviceList.schoolStudents = new Service('/i/schools/{schoolId}/students', binding);
        serviceList.schoolStudentsCount = new Service('/i/schools/{schoolId}/students/count', binding);
        serviceList.schoolStudent = new Service('/i/schools/{schoolId}/students/{studentId}', binding);

        // forms
        serviceList.schoolForms = new Service('/i/schools/{schoolId}/forms', binding);
		serviceList.schoolForm 	= new Service('/i/schools/{schoolId}/forms/{formId}', binding);
        serviceList.publicSchoolForms 	= new Service('/public/schools/{schoolId}/forms');
        serviceList.publicSchoolForm 	= new Service('/public/schools/{schoolId}/forms/{formId}');

        // houses
        serviceList.schoolHouses 	= new Service('/i/schools/{schoolId}/houses', binding);
		serviceList.schoolHouse 	= new Service('/i/schools/{schoolId}/houses/{houseId}', binding);
        serviceList.publicSchoolHouses 	= new Service('/public/schools/{schoolId}/houses', binding);
        serviceList.publicSchoolHouse 	= new Service('/public/schools/{schoolId}/houses/{houseId}', binding);

        // teams
        serviceList.teams = new Service('/i/schools/{schoolId}/teams', binding);
        serviceList.team = new Service('/i/schools/{schoolId}/teams/{teamId}', binding);
        serviceList.schoolTeamStudents = new Service('/i/schools/{schoolId}/teams/{teamId}/students', binding);
        serviceList.teamsBySchoolId = new Service('/i/schools/{schoolId}/teams', binding);
        serviceList.teamPlayers = new Service('/i/schools/{schoolId}/teams/{teamId}/players', binding);
        serviceList.teamPlayer = new Service('/i/schools/{schoolId}/teams/{teamId}/players/{playerId}', binding);

        // news
        serviceList.schoolNews = new Service('/i/schools/{schoolId}/news', binding);
        serviceList.schoolNewsCount = new Service('/i/schools/{schoolId}/news/count', binding);

        //Permission Requests
        serviceList.permissionRequests = new Service('/i/schools/{schoolId}/permissions/requests',binding);
        serviceList.permissionRequestsCount = new Service('/i/schools/{schoolId}/permissions/requests/count',binding);
        serviceList.permissionRequest = new Service('/i/schools/{schoolId}/permissions/requests/{prId}',binding);
        serviceList.statusPermissionRequest = new Service('/i/schools/{schoolId}/permissions/requests/{prId}/status', binding);

        //Permissions
        serviceList.schoolUserPermissions = new Service('/i/schools/{schoolId}/users/{userId}/permissions',binding);
        serviceList.schoolUserPermission = new Service('/i/schools/{schoolId}/users/{userId}/permissions/{permissionId}',binding);

        // sports
        serviceList.sports = new Service('/public/sports', binding);
        serviceList.sport = new Service('/public/sports/{sportId}', binding);

        //events
        serviceList.events = new Service('/i/schools/{schoolId}/events', binding);
        serviceList.schoolEvent = new Service('/i/schools/{schoolId}/events/{eventId}', binding);
        serviceList.schoolEventResult = new Service('/i/schools/{schoolId}/events/{eventId}/result', binding);
        serviceList.addPointToSchoolEventResult = new Service('/i/schools/{schoolId}/events/{eventId}/result/points', binding);
        serviceList.finishSchoolEvent = new Service('/i/schools/{schoolId}/events/{eventId}/finish', binding);
        serviceList.schoolEventInvite = new Service('/i/schools/{schoolId}/events/{eventId}/invite', binding);
        serviceList.addTeamToschoolEvent = new Service('/i/schools/{schoolId}/events/{eventId}/addTeam', binding);

		// invites
		serviceList.schoolInvites = new Service('/i/schools/{schoolId}/invites', binding);
		serviceList.schoolInvite = new Service('/i/schools/{schoolId}/invites/{inviteId}', binding);
		serviceList.acceptSchoolInvite = new Service('/i/schools/{schoolId}/invites/{inviteId}/accept', binding);
		serviceList.declineSchoolInvite = new Service('/i/schools/{schoolId}/invites/{inviteId}/decline', binding);

		// event comments
		serviceList.schoolEventComment = new Service('/i/schools/{schoolId}/events/{eventId}/comments/{commentId}', binding);
		serviceList.schoolEventComments = new Service('/i/schools/{schoolId}/events/{eventId}/comments', binding);
		serviceList.schoolEventCommentsCount = new Service('/i/schools/{schoolId}/events/{eventId}/comments/count', binding);


        serviceList.userChildren = new Service('/users/{id}/children', binding);
		serviceList.userChildrenEvents = new Service('/users/{id}/children/events', binding);
		serviceList.userCoach = new Service('/users/{id}/coaches',binding);
		serviceList.userManager = new Service('/users/{id}/managers',binding);
		serviceList.userTeacher = new Service('/users/{id}/teachers',binding);
		serviceList.userAdmin = new Service('/users/{id}/admins',binding);
		serviceList.userPasswordReset = new Service('/users/reset',binding);
		serviceList.userPermissionWithPermissionId = new Service('/users/{id}/permissions/{fk}',binding);
		serviceList.updateUserPermission = new Service('/users/{id}/permissions/{fk}',binding);
        serviceList.getTotalNumberOfUserModels = new Service('/users/count',binding);

		// schools
		serviceList.schoolInfo = new Service('/schools/findOne?filter[where][id]={id}&filter[include]=postcode', binding);
		serviceList.manager= new Service('/schools/{id}/managers/rel/{fk}',binding);
		serviceList.administrator = new Service('/schools/{id}/admins/rel/{fk}',binding);
		serviceList.addCoach = new Service('/schools/{id}/coaches/rel/{fk}',binding);
		serviceList.addTeacher = new Service('/schools/{id}/teachers/rel/{fk}',binding);
		serviceList.schoolPermissions = new Service('/schools/{id}/permissions',binding);
        serviceList.schoolPermissionsCount = new Service('/schools/{id}/permissions/count',binding);
		serviceList.schoolModelPermission = new Service('/schools/{id}/permissions/{permissionId}',binding);
		serviceList.schoolPermission = new Service('/schools/{id}/permissions/{permissionId}/set',binding);
		serviceList.getThisSchool = new Service('/schools/getAllSchools',binding);

		serviceList.fixturesVsOtherSchool = new Service('/schools/{schoolId}/events/{opponentId}', binding);
		serviceList.fixturesBySchoolId = new Service('/schools/public/events?schoolId={schoolId}', binding);

		serviceList.eventsBySchoolId = new Service('/schools/{schoolId}/events', binding);
		serviceList.ownerSchools = new Service('/schools?filter[where][ownerId]={ownerId}', binding);
		serviceList.schoolOpponents = new Service('/schools/{id}/public/opponents', binding);
		serviceList.getAllSchools = new Service('/public/schools', binding);
		serviceList.publicSchools = new Service('/public/schools', binding);
		serviceList.getMaSchools = new Service('/schools/getMaSchools', binding);

		// students
		serviceList.studentsCount = new Service('/schools/{schoolId}/students/count', binding);
		serviceList.studentUpdate = new Service('/students/{studentId}/update', binding);
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

		serviceList.house = new Service('/houses/{houseId}', binding);
		serviceList.getAllHouses = new Service('/houses', binding);

		serviceList.form = new Service('/forms/{formId}', binding);
		serviceList.getAllForms = new Service('/forms', binding);

		// coaches
		serviceList.schoolCoaches = new Service('/schools/{id}/coaches', binding);
		serviceList.oneSchoolCoache = new Service('/schools/{schoolId}/coaches/{id}', binding);

		//Admins
		serviceList.schoolAdmins = new Service('/schools/{id}/admins',binding);
		serviceList.schoolManager = new Service('/schools/{id}/managers',binding);
		serviceList.schoolTeacher = new Service('/schools/{id}/teachers',binding);

		serviceList.newsCount = new Service('/schools/{schoolId}/news/count', binding);
		serviceList.oneNews = new Service('/news/{formId}', binding);

		serviceList.eventFindOne = new Service('/events/findOne', binding);
		serviceList.event = new Service('/events/{eventId}', binding);
		serviceList.participants = new Service('/events/{eventId}/participants', binding);
		serviceList.relParticipants = new Service('/events/{eventId}/participants/rel/{teamId}', binding);

		// sports
		serviceList.public_sports = new Service('/public/sports', binding);
		serviceList.public_sport =  new Service('/public/sports/{sportId}', binding);

		// invites
		//serviceList.invites = new Service('/invites', binding);
		serviceList.invitesFindOne = new Service('/invites/findOne', binding);
		serviceList.invite = new Service('/invites/{inviteId}', binding);
		serviceList.invitesByEvent = new Service('/events/{eventId}/invites', binding);
		serviceList.inviteRepay = new Service('/invites/{inviteId}/repay', binding);

		// teams
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

		// postcode
		serviceList.postCode = new Service('/postcodes', binding);
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
		//Permissions
		serviceList.Permissions = new Service('/permissions',binding);
		serviceList.Permission = new Service('/permissions/{id}', binding);
		serviceList.PermissionCount = new Service('/permissions/count', binding);

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
		/*Instead of find one we find all because we don't know school id when user click or type in school domain url
		* so we query all schools 
		* */
		serviceList.publicSchools = new Service('/public/schools');

		/* I don't like idea of using window.apiImg here, but it was easiest solution withoug global refactoring */
		serviceList.images = new ImageService(window.apiImg);
	}
};

serviceList.initializeOpenServices();


module.exports = serviceList;
