/**
 * Created by Anatoly on 11.03.2016.
 */
const   Lazy        = require('lazyjs');

const FilteringServices = {
    allSchoolsFiltering: function (filter) {
        return window.Server.getAllSchools.get({
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
    maSchoolsFiltering: function (filter) {
        return window.Server.getMaSchools.get({
            filter: {
                presets: ['owner', 'admin', 'manager', 'teacher', 'coach', 'student'],
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
                    'userInfo.lastName': {
                        like: filter,
                        options: 'i'
                    }
                },
                limit: 10
            }
        }).then(students => {
            return Lazy(students).map(student => {
                student.fullName = student.userInfo.firstName + ' ' + student.userInfo.lastName;
                return student;
            }).toArray();
        });
    }
};

module.exports = FilteringServices;

