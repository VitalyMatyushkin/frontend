const 	Service 		    = require('module/core/service'),
		ImageService 	    = require('module/core/services/ImageService'),
        FilteringServices 	= require('module/core/services/FilteringServices');


/** Collection of services to reach REST API from server */
const serviceList = {
	// Services which require authorization
	initialize: function(binding) {

        // authorization
        serviceList._login = new Service('/i/login', binding);
        serviceList.roles = new Service('/i/roles', binding);
        serviceList._become = new Service('/i/roles/{roleName}/become', binding);

		// password
		serviceList.passwordsResetRequest = new Service('/public/passwords/resetRequest', binding);
		serviceList.passwordsReset = new Service('/public/passwords/reset', binding);

        // profile
        serviceList.profile = new Service('/i/profile', binding);
        serviceList.profileEmail = new Service('/i/profile/email', binding);
        serviceList.profileEmailResend = new Service('/i/profile/email/resend', binding);
        serviceList.profilePhone = new Service('/i/profile/phone', binding);
        serviceList.profilePhoneResend = new Service('/i/profile/phone/resend', binding);
        serviceList.profilePermissions = new Service('/i/permissions', binding);
        serviceList.profilePermission = new Service('/i/permissions/{permissionId}', binding);
        serviceList.profileRequests = new Service('/i/permissions/requests', binding);
        serviceList.profileRequest = new Service('/i/permissions/requests/{prId}', binding);
        serviceList.changePassword = new Service('/i/profile/password', binding);

        // users
        serviceList.confirmUser = new Service('/i/confirm/email',binding);
        serviceList.confirmUserPhone = new Service('/i/confirm/phone',binding);
        serviceList.users = new Service('/i/schools/{schoolId}/users', binding);
        serviceList.usersCount = new Service('/i/schools/{schoolId}/users/count', binding);
        serviceList.user = new Service('/i/schools/{schoolId}/users/{userId}', binding);

        // schools
        serviceList.schools = new Service('/i/schools', binding);
        serviceList.schoolUnionSchools = new Service('/i/schools/{schoolUnionId}/schools', binding);
        serviceList.schoolUnionSchool = new Service('/i/schools/{schoolUnionId}/schools/{schoolId}', binding);
        serviceList.school = new Service('/i/schools/{schoolId}', binding);
        serviceList.schoolSettings = new Service('/i/schools/{schoolId}/settings', binding);
        serviceList.publicSchool = new Service('/public/schools/{schoolId}', binding);
        serviceList.publicSchools = new Service('/public/schools', binding);
        serviceList.publicSchoolCheckPassword = new Service('/public/schools/{schoolId}/publicSite/password/check', binding);

		serviceList.schoolSports = new Service('/i/schools/{schoolId}/sports', binding);
		serviceList.schoolSport = new Service('/i/schools/{schoolId}/sports/{sportId}', binding);

		// places
		serviceList.schoolPlaces = new Service('/i/schools/{schoolId}/places', binding);
		serviceList.schoolPlace = new Service('/i/schools/{schoolId}/places/{placeId}', binding);
		serviceList.schoolPlacesAndPostcodes = new Service('/i/schools/{schoolId}/placesAndPostcodes', binding);

		// students
        serviceList.schoolStudents = new Service('/i/schools/{schoolId}/students', binding);
        serviceList.schoolStudentsCount = new Service('/i/schools/{schoolId}/students/count', binding);
        serviceList.schoolStudent = new Service('/i/schools/{schoolId}/students/{studentId}', binding);
        serviceList.schoolStudentParents = new Service('/i/schools/{schoolId}/students/{studentId}/parents', binding);
        serviceList.schoolStudentEvents = new Service('/i/schools/{schoolId}/students/{studentId}/events', binding);


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
        serviceList.cloneTeam = new Service('/i/schools/{schoolId}/teams/{teamId}/clone', binding);
        serviceList.cloneAsPrototypeTeam = new Service('/i/schools/{schoolId}/teams/{teamId}/copyAsPrototype', binding);
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
        serviceList.publicSchoolUnionStats = new Service('/public/schools/{schoolUnionId}/events/stats', binding);
        serviceList.publicSchoolUnionSchools = new Service('/public/schools/{schoolUnionId}/schools', binding);
		serviceList.eventCancel = new Service('/i/schools/{schoolId}/events/{eventId}/cancel', binding);
		serviceList.schoolEventChangeOpponent = new Service('/i/schools/{schoolId}/events/{eventId}/changeOpponent', binding);
		serviceList.schoolEvent = new Service('/i/schools/{schoolId}/events/{eventId}', binding);
		serviceList.schoolEventDetails = new Service('/i/schools/{schoolId}/events/{eventId}/details', binding);
		serviceList.schoolEventDates = new Service('/i/schools/{schoolId}/events/dates/distinct', binding);
		serviceList.schoolEventActivate = new Service('/i/schools/{schoolId}/events/{eventId}/activate', binding);
        serviceList.schoolEventTeams = new Service('/i/schools/{schoolId}/events/{eventId}/teams', binding);
        serviceList.schoolEventTeam = new Service('/i/schools/{schoolId}/events/{eventId}/teams/{teamId}', binding);
        serviceList.schoolEventPhoto = new Service('/i/schools/{schoolId}/events/{eventId}/photos/{photoId}', binding);
        serviceList.schoolEventPhotos = new Service('/i/schools/{schoolId}/events/{eventId}/photos', binding);

		// event individuals
		serviceList.schoolEventIndividual = new Service('/i/schools/{schoolId}/events/{eventId}/individuals/{individualId}', binding);
        serviceList.schoolEventIndividuals = new Service('/i/schools/{schoolId}/events/{eventId}/individuals/', binding);
        serviceList.schoolEventIndividualsBatch = new Service('/i/schools/{schoolId}/events/{eventId}/individuals/batch', binding);

		// event individual performance
		serviceList.schoolEventIndividualPerformance = new Service('/i/schools/{schoolId}/events/{eventId}/results/individuals/performance', binding);
		serviceList.schoolEventIndividualPerformancePoint = new Service('/i/schools/{schoolId}/events/{eventId}/results/individuals/performance/{performancePointId}', binding);
		serviceList.schoolEventIndividualDiscipline = new Service('/i/schools/{schoolId}/events/{eventId}/results/individuals/discipline', binding);
		serviceList.schoolEventIndividualDisciplinePoint = new Service('/i/schools/{schoolId}/events/{eventId}/results/individuals/discipline/{disciplinePointId}', binding);

		serviceList.schoolEventResultSchoolScores = new Service('/i/schools/{schoolId}/events/{eventId}/results/schools/score', binding);
		serviceList.schoolEventResultSchoolScore = new Service('/i/schools/{schoolId}/events/{eventId}/results/schools/score/{scoreId}', binding);
		serviceList.schoolEventResultTeamScores = new Service('/i/schools/{schoolId}/events/{eventId}/results/teams/score', binding);
		serviceList.schoolEventResultTeamScore = new Service('/i/schools/{schoolId}/events/{eventId}/results/teams/score/{scoreId}', binding);
		serviceList.schoolEventResultHousesScores = new Service('/i/schools/{schoolId}/events/{eventId}/results/houses/score', binding);
		serviceList.schoolEventResultHousesScore = new Service('/i/schools/{schoolId}/events/{eventId}/results/houses/score/{scoreId}', binding);
        serviceList.schoolEventResultIndividualsScores = new Service('/i/schools/{schoolId}/events/{eventId}/results/individuals/score', binding);
        serviceList.schoolEventResultIndividualsScore = new Service('/i/schools/{schoolId}/events/{eventId}/results/individuals/score/{scoreId}', binding);
        serviceList.schoolEventTeamPlayers = new Service('/i/schools/{schoolId}/events/{eventId}/teams/{teamId}/players', binding);
		serviceList.schoolEventResult = new Service('/i/schools/{schoolId}/events/{eventId}/result', binding);
		serviceList.schoolEventReport = new Service('/i/schools/{schoolId}/events/{eventId}/report', binding);
		serviceList.schoolEventTasks = new Service('/i/schools/{schoolId}/events/{eventId}/tasks', binding);
		serviceList.schoolEventTask = new Service('/i/schools/{schoolId}/events/{eventId}/tasks/{taskId}', binding);

        serviceList.addPointToSchoolEventResult = new Service('/i/schools/{schoolId}/events/{eventId}/result/points', binding);
        serviceList.finishSchoolEvent = new Service('/i/schools/{schoolId}/events/{eventId}/finish', binding);
        serviceList.schoolEventInvite = new Service('/i/schools/{schoolId}/events/{eventId}/invite', binding);
        serviceList.addTeamToschoolEvent = new Service('/i/schools/{schoolId}/events/{eventId}/addTeam', binding);

		serviceList.publicSchoolEvent = new Service('/public/schools/{schoolId}/events/{eventId}', binding);
		serviceList.publicSchoolEvents = new Service('/public/schools/{schoolId}/events', binding);
		serviceList.publicSchoolEventReport = new Service('/public/schools/{schoolId}/events/{eventId}/report', binding);
		serviceList.publicSchoolEventTeams = new Service('/public/schools/{schoolId}/events/{eventId}/teams', binding);
		serviceList.publicSchoolEventTeam = new Service('/public/schools/{schoolId}/events/{eventId}/teams/{teamId}', binding);
		serviceList.publicSchoolEventDates = new Service('/public/schools/{schoolId}/events/dates/distinct', binding);
		serviceList.publicSchoolEventPhotos = new Service('/public/schools/{schoolId}/events/{eventId}/photos', binding);

		// invites
		serviceList.schoolInvites 				= new Service('/i/schools/{schoolId}/invites', binding);
		serviceList.schoolInvite 				= new Service('/i/schools/{schoolId}/invites/{inviteId}', binding);
		serviceList.schoolInboxInvites 			= new Service('/i/schools/{schoolId}/invites/inbox', binding);
		serviceList.schoolOutboxInvites 		= new Service('/i/schools/{schoolId}/invites/outbox', binding);
		serviceList.schoolArchiveInvites		= new Service('/i/schools/{schoolId}/invites/archive', binding);
		serviceList.acceptSchoolInvite			= new Service('/i/schools/{schoolId}/invites/{inviteId}/accept', binding);
		serviceList.declineSchoolInvite			= new Service('/i/schools/{schoolId}/invites/{inviteId}/reject', binding);
		serviceList.schoolInviteComments		= new Service('/i/schools/{schoolId}/invites/{inviteId}/comments', binding);
		serviceList.schoolInviteCommentsCount	= new Service('/i/schools/{schoolId}/invites/{inviteId}/comments/count', binding);

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
		serviceList.children = new Service('/i/children', binding);
		serviceList.childrenEvents = new Service('/i/children/events', binding);
		serviceList.childrenEventsDates = new Service('/i/children/events/dates/distinct', binding);
		serviceList.childrenEventsCount = new Service('/i/children/events/count', binding);
		serviceList.child = new Service('/i/children/{childId}', binding);
		serviceList.childEvents = new Service('/i/children/{childId}/events', binding);
		serviceList.childEventPhotos = new Service('/i/children/events/{eventId}/photos', binding);
		serviceList.childEventPhoto = new Service('/i/children/events/{eventId}/photos/{photoId}', binding);
		serviceList.childParents = new Service('/i/children/{childId}/parents', binding);


		// new role student
		serviceList.studentSchoolEventsCount = new Service('/i/events/stats', binding);
		serviceList.studentSchoolEventsDates = new Service('/i/events/dates/distinct', binding);
		serviceList.studentSchoolEvents = new Service('/i/events', binding);
		serviceList.studentSchoolEvent = new Service('/i/events/{eventId}', binding);
		
		// Integrations
		serviceList.integrationGoogleCalendar = new Service('/i/schools/{schoolId}/integrations/googlecalendar', binding);
		serviceList.integrationTwitter = new Service('/i/schools/{schoolId}/integrations/twitter', binding);
		serviceList.integrationTwitterTweet = new Service('/i/schools/{schoolId}/integrations/twitter/{twitterId}/tweet', binding);
		serviceList.integrations = new Service('/i/schools/{schoolId}/integrations', binding);
		serviceList.integration = new Service('/i/schools/{schoolId}/integrations/{integrationId}', binding);

		// postcode
		serviceList.postCodes = new Service('/public/postcodes', binding);
		serviceList.postCodeById = new Service('/public/postcodes/{postcodeId}', binding);


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


module.exports = serviceList;
