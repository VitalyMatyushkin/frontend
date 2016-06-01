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


        //Filtering services
        serviceList.publicSchools.filter = FilteringServices.allSchoolsFiltering;       //(filter)
        serviceList.schoolStudents.filter = FilteringServices.studentsFilteringByLastName;    //(schoolId, filter)

	},
	// Services which not require authorization
	initializeOpenServices: function() {
		// schools
		serviceList.publicSchools = new Service('/public/schools');
		
		/* I don't like idea of using window.apiImg here, but it was easiest solution withoug global refactoring */
		serviceList.images = new ImageService(window.apiImg);
	}
};

serviceList.initializeOpenServices();


module.exports = serviceList;
