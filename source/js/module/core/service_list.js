var Service = require('module/core/service'),
	serviceList,
	binding;


serviceList = {
	initialize: function(binding) {
        serviceList.me = new Service('/users/{ownerId}', binding);

		// schools
		serviceList.schools = new Service('/schools', binding);
		serviceList.school = new Service('/schools/{id}', binding);
		serviceList.ownerSchools = new Service('/schools?filter[where][ownerId]={ownerId}', binding);

		// leaners
        serviceList.learners = new Service('/schools/{schoolId}/learners', binding);
		serviceList.learnersFilter = new Service('/learners', binding);
		serviceList.learner = new Service('/schools/{}/learners/{learnerId}', binding);

		// houses
        serviceList.houses = new Service('/schools/{schoolId}/houses', binding);
		serviceList.housesFilter = new Service('/houses', binding);
		serviceList.house = new Service('/houses/{houseId}', binding);

		// classes
		serviceList.classes = new Service('/classes?filter[where][schoolId]={schoolId}', binding);
		serviceList.classesFilter = new Service('/classes', binding);
		serviceList.class = new Service('/classes/{classId}', binding);

		//events
        serviceList.teamsBySchoolId = new Service('/teams?filter[where][schoolId]={schoolId}&filter[include]=events', binding);

        // sports
        serviceList.sports = new Service('/sports', binding);

        // invites
        serviceList.invites = new Service('/invites?filter[where][or][0][inviterId]={schoolId}&filter[where][or][1][invitedId]={schoolId}', binding);
    }
};




module.exports = serviceList;