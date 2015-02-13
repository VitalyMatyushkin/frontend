var Service = require('module/core/service'),
	serviceList,
	binding;


serviceList = {
	initialize: function(binding) {
        serviceList.me = new Service('/users/{ownerId}', binding);
		serviceList.schools = new Service('/schools', binding);
		serviceList.school = new Service('/schools/{id}', binding);
		serviceList.ownerSchools = new Service('/schools?filter[where][ownerId]={ownerId}', binding);
        serviceList.learners = new Service('/schools/{schoolId}/learners', binding);
        serviceList.houses = new Service('/schools/{schoolId}/houses', binding);
        serviceList.classes = new Service('/schools/{schoolId}/classes', binding);
        serviceList.learner = new Service('/schools/{schoolId}/learners/{learnerId}', binding);
        serviceList.house = new Service('/schools/{schoolId}/houses/{houseId}', binding);
        serviceList.classe = new Service('/schools/{schoolId}/classes/{classId}', binding);
	}
};




module.exports = serviceList;