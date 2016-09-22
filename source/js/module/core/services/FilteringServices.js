/**
 * Created by Anatoly on 11.03.2016.
 */
const   Lazy        = require('lazy.js');

const FilteringServices = {
    allSchoolsFiltering: function (filter) {
        return window.Server.publicSchools.get({
            filter: {
                where: {
                    name: {
                        like: filter,
                        options: 'i'
                    }
                },
                limit: 400
            }
        });
    },
    maSchoolsFiltering: function (filter) {
        return window.Server.schools.get({
            filter: {
                where: {
                    name: {
                        like: filter,
                        options: 'i'
                    }
                },
                limit: 10
            }
        });
    },

    studentsFilteringByLastName: function (schoolId, filter) {
        return window.Server.schoolStudents.get(schoolId, {
            filter: {
                where: {
                    lastName: {
                        like: filter,
                        options: 'i'
                    }
                },
                limit: 10
            }
        }).then(students => {
            return Lazy(students).map(student => {
                student.fullName = student.firstName + ' ' + student.lastName;
                return student;
            }).toArray();
        });
    }
};

module.exports = FilteringServices;

