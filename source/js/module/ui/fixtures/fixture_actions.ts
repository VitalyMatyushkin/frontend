export const FixtureActions = {
    fixturesCountOnPage: 20,
    fixturesCountLimit: 20,

    loadData: function (page, schoolId, gteDate, ltDate) {
        return (window as any).Server.events.get(schoolId,
            {
                filter: {
                    skip: this.fixturesCountOnPage * (page - 1),
                    limit: this.fixturesCountLimit,
                    where: {
                        startTime: {
                            '$gte': gteDate,// like this `2016-07-01T00:00:00.000Z`,
                            '$lt':  ltDate// like this `2016-07-31T00:00:00.000Z`
                        }
                    },
                    order: 'startTime ASC'
                }
            }
        )
    },

    loadDataForParent: function (page, schoolId, gteDate, ltDate, childIdList) {
        return (window as any).Server.childrenEvents.get(schoolId,
            {
                filter: {
                    skip: this.fixturesCountOnPage * (page - 1),
                    limit: this.fixturesCountLimit,
                    where: {
                        startTime: {
                            '$gte': gteDate,// like this `2016-07-01T00:00:00.000Z`,
                            '$lt':  ltDate// like this `2016-07-31T00:00:00.000Z`
                        },
                        status: {
                            $in: ['ACCEPTED', 'FINISHED']
                        },
                        childIdList: childIdList
                    },
                    order: 'startTime ASC'
                }
            }
        )
    },

    loadDataForStudent: function (page, schoolId, gteDate, ltDate) {
        let filter;
        if (schoolId === '' || typeof schoolId === 'undefined') {
            filter = {
                skip: this.fixturesCountOnPage * (page - 1),
                limit: this.fixturesCountLimit,
                where: {
                    startTime: {
                        $gte: 	gteDate,
                        $lt: 	ltDate
                    },
                    status: {
                        $in: ['ACCEPTED', 'FINISHED']
                    }
                },
                order: 'startTime ASC'
            };
        } else {
            filter = {
                skip: this.fixturesCountOnPage * (page - 1),
                limit: this.fixturesCountLimit,
                where: {
                    startTime: {
                        $gte: 	gteDate,
                        $lt: 	ltDate
                    },
                    status: {
                        $in: ['ACCEPTED', 'FINISHED']
                    },
                    schoolId: {
                        $in: schoolId
                    }
                },
                order: 'startTime ASC'
            };
        }
        return (window as any).Server.studentSchoolEvents.get({ filter: filter });
    }
};