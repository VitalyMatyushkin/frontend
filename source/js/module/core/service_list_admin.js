const 	Service 		    = require('module/core/service'),
		ImageService 	    = require('module/core/services/ImageService'),
        FilteringServices 	= require('module/core/services/FilteringServices');


/** Collection of services to reach REST API from server */
const serviceList = {
	// Services which require authorization
	initialize: function(binding) {
		// authorization
		serviceList._login = new Service('/superadmin/login',binding);

		serviceList.apps = new Service('/superadmin/apps', binding);
		serviceList.app = new Service('/superadmin/apps/{appId}', binding);

		// users
		serviceList.users = new Service('/superadmin/users', binding);
		serviceList.usersForceEmailVefication = new Service('/superadmin/users/{userId}/verification/status/email', binding);
		serviceList.usersForcePhoneVefication = new Service('/superadmin/users/{userId}/verification/status/sms', binding);
		serviceList.user = new Service('/superadmin/users/{userId}', binding);
		serviceList.usersCount = new Service('/superadmin/users/count', binding);
		serviceList.userBlock = new Service('/superadmin/users/{userId}/block', binding);

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
		serviceList.schoolsCount = new Service('/superadmin/schools/count', binding);
		serviceList.school = new Service('/superadmin/schools/{schoolId}', binding);
		serviceList.publicSchools = new Service('/public/schools', binding);

		serviceList.schoolSports = new Service('/superadmin/schools/{schoolId}/sports', binding);
		serviceList.schoolSport = new Service('/superadmin/schools/{schoolId}/sports/{sportId}', binding);

		// sports
		serviceList.sports = new Service('/superadmin/sports', binding);
		serviceList.sport =  new Service('/superadmin/sports/{sportId}', binding);

		// postcode
		serviceList.postCodes = new Service('/superadmin/postcodes', binding);
		serviceList.postCode = new Service('/superadmin/postcodes/{postcodeId}', binding);

		// forms
		serviceList.schoolForms = new Service('/superadmin/schools/{schoolId}/forms', binding);
		serviceList.schoolForm = new Service('/superadmin/schools/{schoolId}/forms/{formId}', binding);

		// houses
		serviceList.schoolHouses = new Service('/superadmin/schools/{schoolId}/houses', binding);
		serviceList.schoolHouse = new Service('/superadmin/schools/{schoolId}/houses/{houseId}', binding);

		// students
		serviceList.schoolStudents = new Service('/superadmin/schools/{schoolId}/students', binding);
		serviceList.schoolStudentsCount = new Service('/superadmin/schools/{schoolId}/students/count', binding);
		serviceList.schoolStudent = new Service('/superadmin/schools/{schoolId}/students/{studentId}', binding);
		serviceList.schoolStudentMerge = new Service('/superadmin/schools/{schoolId}/students/{studentId}/merge', binding);

		// activity logs
		serviceList.useractivity = new Service('/superadmin/useractivity', binding);
		serviceList.useractivityCount = new Service('/superadmin/useractivity/count', binding);

		//events
		serviceList.events = new Service('/superadmin/schools/{schoolId}/events', binding);
		serviceList.event = new Service('/superadmin/schools/{schoolId}/events/{eventId}', binding);

		//Notifications
		serviceList.userNotificationChannels = new Service('/superadmin/users/{userId}/notifications/channels', binding);
		serviceList.userNotificationChannel = new Service('/superadmin/users/{userId}/notifications/channels/{channelId}', binding);
		serviceList.userNotificationChannelMessage = new Service('/superadmin/users/{userId}/notifications/channels/{channelId}/message', binding);
		serviceList.notifications = new Service('/superadmin/users/{userId}/notifications', binding);
		serviceList.schoolNotifications = new Service('/superadmin/schools/{schoolId}/notifications', binding);
		
		//Invites
		serviceList.invites = new Service('/superadmin/users/invites', binding);
		serviceList.invite = new Service('/superadmin/users/invites/{inviteId}', binding);
		
		//age group
		serviceList.ageGroups = new Service('/superadmin/schools/{schoolId}/ages', binding);
		
		//export students
		serviceList.exportStudents = new Service('/superadmin/schools/{schoolId}/export/students', binding);
		
		//activate students
		serviceList.activateStudents = new Service('/superadmin/schools/{schoolId}/students/activate', binding);

		//Filtering services
		serviceList.publicSchools.filter = FilteringServices.allSchoolsFiltering;				//(filter)
		serviceList.schoolStudents.filter = FilteringServices.studentsFilteringByLastName;		//(schoolId, filter)
	},
	// Services which not require authorization
	initializeOpenServices: function() {
		// schools
		serviceList.publicSchools = new Service('/public/schools');
		
		/* I don't like idea of using window.apiImg here, but it was easiest solution withoug global refactoring */
		serviceList.images = new ImageService(window.apiImg);
	}
};


module.exports = serviceList;
