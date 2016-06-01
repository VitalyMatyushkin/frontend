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

		// password
		serviceList.passwordsResetRequest = new Service('/public/passwords/resetRequest', binding);
		serviceList.passwordsReset = new Service('/public/passwords/reset', binding);

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
        serviceList.school = new Service('/i/schools/{schoolId}', binding);
        serviceList.publicSchool = new Service('/public/schools/{schoolId}', binding);
        serviceList.publicSchools = new Service('/public/schools', binding);


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
        serviceList.publicSchoolNews = new Service('/public/schools/{schoolId}/news',binding);
        serviceList.schoolNewsItem = new Service('/i/schools/{schoolId}/news/{newsId}',binding);

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
        serviceList.schoolEventTeams = new Service('/i/schools/{schoolId}/events/{eventId}/teams', binding);
        serviceList.schoolEventResult = new Service('/i/schools/{schoolId}/events/{eventId}/result', binding);
        serviceList.addPointToSchoolEventResult = new Service('/i/schools/{schoolId}/events/{eventId}/result/points', binding);
        serviceList.finishSchoolEvent = new Service('/i/schools/{schoolId}/events/{eventId}/finish', binding);
        serviceList.schoolEventInvite = new Service('/i/schools/{schoolId}/events/{eventId}/invite', binding);
        serviceList.addTeamToschoolEvent = new Service('/i/schools/{schoolId}/events/{eventId}/addTeam', binding);

		serviceList.publicSchoolEvent = new Service('/public/schools/{schoolId}/events/{eventId}', binding);
		serviceList.publicSchoolEvents = new Service('/public/schools/{schoolId}/events', binding);
		serviceList.publicSchoolEventTeams = new Service('/public/schools/{schoolId}/events/{eventId}/teams', binding);

		// invites
		serviceList.schoolInvites = new Service('/i/schools/{schoolId}/invites', binding);
		serviceList.schoolInvite = new Service('/i/schools/{schoolId}/invites/{inviteId}', binding);
		serviceList.acceptSchoolInvite = new Service('/i/schools/{schoolId}/invites/{inviteId}/accept', binding);
		serviceList.declineSchoolInvite = new Service('/i/schools/{schoolId}/invites/{inviteId}/decline', binding);

		// event comments
		serviceList.schoolEventComment = new Service('/i/schools/{schoolId}/events/{eventId}/comments/{commentId}', binding);
		serviceList.schoolEventComments = new Service('/i/schools/{schoolId}/events/{eventId}/comments', binding);
		serviceList.schoolEventCommentsCount = new Service('/i/schools/{schoolId}/events/{eventId}/comments/count', binding);

        // albums
        serviceList.schoolAlbum = new Service('/i/schools/{schoolId}/albums/{albumId}', binding);
        serviceList.schoolEventAlbums = new Service('/i/schools/{schoolId}/events/{eventId}/albums', binding);
        serviceList.schoolEventAlbum = new Service('/i/schools/{schoolId}/events/{eventId}/albums/{albumId}', binding);

        // photos
        serviceList.schoolAlbumPhotos = new Service('/i/schools/{schoolId}/albums/{albumId}/photos', binding);
        serviceList.schoolAlbumPhoto = new Service('/i/schools/{schoolId}/albums/{albumId}/photos/{photoId}', binding);
		serviceList.schoolEventAlbumPhotos = new Service('/i/schools/{schoolId}/events/{eventId}/albums/{albumId}/photos', binding);
		serviceList.schoolEventAlbumPhoto = new Service('/i/schools/{schoolId}/events/{eventId}/albums/{albumId}/photos/{photoId}', binding);
		serviceList.publicSchoolAlbumPhotos = new Service('/public/schools/{schoolId}/albums/{albumId}/photos', binding);

		// children
		serviceList.userChildren = new Service('/i/children', binding);
		serviceList.userChild = new Service('/i/children/{childId}', binding);
		serviceList.userChildEvents = new Service('/i/children/{childId}/events', binding);
		serviceList.parentsChild = new Service('/i/children/{childId}/parents', binding);

		// postcode
		serviceList.postCode = new Service('/public/postcodes', binding);
		serviceList.findPostCodeById = new Service('/public/postcodes/{postCode}', binding);


        //Filtering services
        serviceList.publicSchools.filter = FilteringServices.allSchoolsFiltering;       //(filter)
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
